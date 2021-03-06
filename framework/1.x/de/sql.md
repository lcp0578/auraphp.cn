---
layout: docs-de
title: Aura SQL
permalink: /framework/1.x/de/sql/
---

#Aura SQL#

The Aura SQL package provides connections to connect to and query against SQL
data sources such as MySQL, PostgreSQL, and Sqlite. The connections are mostly
wrappers around [PDO](http://php.net/PDO) connections.

Aura SQL comes with four connection adapters: `'mysql'` for MySQL, `'pgsql'`
for PostgreSQL, `'sqlite'` for SQLite3, and `'sqlsrv'` for Microsoft SQL
Server.

## Instantiation ##

> If you are using Aura.Sql with dependency injection, you can skip to
next topic connecting.

The easiest way to get started is to use the `scripts/instance.php` script to
get a `ConnectionFactory` and create your connection through it:

{% highlight php %}
<?php
$connection_factory = include '/path/to/Aura.Sql/scripts/instance.php';
$connection = $connection_factory->newInstance(

    // adapter name
    'mysql',

    // DSN elements for PDO; this can also be
    // an array of key-value pairs
    'host=localhost;dbname=database_name',

    // username for the connection
    'username',

    // password for the connection
    'password'
);
{% endhighlight %}

Alternatively, you can add `'/path/to/Aura.Sql/src'` to your autoloader and
build an connection factory manually:

{% highlight php %}
<?php
use Aura\Sql\ConnectionFactory;
$connection_factory = new ConnectionFactory;
$connection = $connection_factory->newInstance(...);
{% endhighlight %}

Aura SQL comes with four connection adapters: `'mysql'` for MySQL, `'pgsql'`
for PostgreSQL, `'sqlite'` for SQLite3, and `'sqlsrv'` for Microsoft SQL
Server.

## Connecting ##

The connection will lazy-connect to the database the first time you issue a
query of any sort. This means you can create the connection object, and if you
never issue a query, it will never connect to the database.

You can connect manually by issuing `connect()`:

{% highlight php %}
<?php
$connection->connect();
{% endhighlight %}

## Fetching Results ##

Once you have a connection, you can begin to fetch results from the database.


{% highlight php %}
<?php
// returns all rows
$result = $connection->fetchAll('SELECT * FROM foo');
{% endhighlight %}

You can fetch results using these methods:

- `fetchAll()` returns a sequential array of all rows. The rows themselves are
  associative arrays where the keys are the column names.

- `fetchAssoc()` returns an associative array of all rows where the key is the
  first column.

- `fetchCol()` returns a sequential array of all values in the first column.

- `fetchOne()` returns the first row as an associative array where the keys
  are the column names.

- `fetchPairs()` returns an associative array where each key is the first
  column and each value is the second column.

- `fetchValue()` returns the value of the first row in the first column.


## Preventing SQL Injection ##

Usually you will need to incorporate user-provided data into the query. This
means you should quote all values interpolated into the query text as a
security measure to [prevent SQL injection](http://bobby-tables.com/).

Although Aura SQL provides quoting methods, you should instead use value
binding into prepared statements. To do so, put named placeholders in the
query text, then pass an array of values to bind to the placeholders:

{% highlight php %}
<?php
// the text of the query
$text = 'SELECT * FROM foo WHERE id = :id';

// values to bind to query placeholders
$bind = [
    'id' => 1,
];

// returns one row; the data has been parameterized
// into a prepared statement for you
$result = $connection->fetchOne($text, $bind);
{% endhighlight %}

Aura SQL recognizes array values and quotes them as comma-separated lists:

{% highlight php %}
<?php
// the text of the query
$text = 'SELECT * FROM foo WHERE id = :id AND bar IN(:bar_list)';

// values to bind to query placeholders
$bind = [
    'id' => 1,
    'bar_list' => ['a', 'b', 'c'],
];

// returns all rows; the query ends up being
// "SELECT * FROM foo WHERE id = 1 AND bar IN('a', 'b', 'c')"
$result = $connection->fetchOne($text, $bind);
{% endhighlight %}

## Query Objects ##

Aura SQL provides four types of query objects so you can write your SQL
queries in an object-oriented way.

## Select ##

To get a new `Select` object, invoke the `newSelect()` method on an connection.
You can then modify the `Select` object and pass it to the `query()` or
`fetch*()` method.

{% highlight php %}
<?php
// create a new Select object
$select = $connection->newSelect();

// SELECT * FROM foo WHERE bar > :bar ORDER BY baz
$select->cols(['*'])
       ->from('foo')
       ->where('bar > :bar')
       ->orderBy('baz');

$bind = ['bar' => '88'];

$list = $connection->fetchAll($select, $bind);
{% endhighlight %}

The `Select` object has these methods and more; please read the source code
for more information.

- `distinct()`: Set to `true` for a `SELECT DISTINCT`.

- `cols()`: Select these columns.

- `from()`: Select from these tables.

- `join()`: Join these tables on specified conditions.

- `where()`: `WHERE` these conditions are met (using `AND`).

- `orWhere()`: `WHERE` these conditions are met (using `OR`).

- `groupBy()`: `GROUP BY` these columns.

- `having()`: `HAVING` these conditions met (using `AND`).

- `orHaving()`: `HAVING` these conditions met (using `OR`).

- `orderBy()`: `ORDER BY` these columns.

- `limit()`: `LIMIT` to this many rows.

- `offset()`: `OFFSET` by this many rows.

- `union()`: `UNION` with a followup `SELECT`.

- `unionAll()`: `UNION ALL` with a followup `SELECT`.

## Insert ##

To get a new `Insert` object, invoke the `newInsert()` method on an connection.
You can then modify the `Insert` object and pass it to the `query()` method.

{% highlight php %}
<?php
// create a new Insert object
$insert = $connection->newInsert();

// INSERT INTO foo (bar, baz, date) VALUES (:bar, :baz, NOW());
$insert->into('foo')
       ->cols(['bar', 'baz'])
       ->set('date', 'NOW()');

$bind = [
    'bar' => null,
    'baz' => 'zim',
];

$stmt = $connection->query($insert, $bind);
{% endhighlight %}

## Update ##

To get a new `Update` object, invoke the `newUpdate()` method on an connection.
You can then modify the `Update` object and pass it to the `query()` method.

{% highlight php %}
<?php
// create a new Update object
$update = $connection->newUpdate();

// UPDATE foo SET bar = :bar, baz = :baz, date = NOW() WHERE zim = :zim OR gir = :gir
$update->table('foo')
       ->cols(['bar', 'baz'])
       ->set('date', 'NOW()')
       ->where('zim = :zim')
       ->orWhere('gir = :gir');

$bind = [
    'bar' => 'barbar',
    'baz' => 99,
    'zim' => 'dib',
    'gir' => 'doom',
];

$stmt = $connection->query($update, $bind);
{% endhighlight %}

## Delete ##

To get a new `Delete` object, invoke the `newDelete()` method on an connection.
You can then modify the `Delete` object and pass it to the `query()` method.

{% highlight php %}
<?php
// create a new Delete object
$delete = $connection->newDelete();

// DELETE FROM WHERE zim = :zim OR gir = :gir
$delete->from('foo')
       ->where('zim = :zim')
       ->orWhere('gir = :gir');

$bind = [
    'zim' => 'dib',
    'gir' => 'doom',
];

$stmt = $connection->query($delete, $bind);
{% endhighlight %}

## Retrieving Table Information ##

To get a list of tables in the database, issue `fetchTableList()`:

{% highlight php %}
<?php
// get the list of tables
$list = $connection->fetchTableList();

// show them
foreach ($list as $table) {
    echo $table . PHP_EOL;
}
{% endhighlight %}

To get information about the columns in a table, issue `fetchTableCols()`:

{% highlight php %}
<?php
// the table to get cols for
$table = 'foo';

// get the cols
$cols = $connection->fetchTableCols($table);

// show them
foreach ($cols as $name => $col) {
    echo "Column $name is of type "
       . $col->type
       . " with a size of "
       . $col->size
       . PHP_EOL;
}
{% endhighlight %}

Each column description is a `Column` object with the following properties:

- `name`: (string) The column name

- `type`: (string) The column data type.  Data types are as reported by the database.

- `size`: (int) The column size.

- `scale`: (int) The number of decimal places for the column, if any.

- `notnull`: (bool) Is the column marked as `NOT NULL`?

- `default`: (mixed) The default value for the column. Note that sometimes this will be `null` if the underlying database is going to set a timestamp automatically.

- `autoinc`: (bool) Is the column auto-incremented?

- `primary`: (bool) Is the column part of the primary key?

## Transactions ##

Aura SQL connections always start in autocommit mode (the same as PDO). However,
you can turn off autocommit mode and start a transaction with
`beginTransaction()`, then either `commit()` or `rollBack()` the transaction.
Commits and rollbacks cause the connection to go back into autocommit mode.

{% highlight php %}
<?php
// turn off autocommit and start a transaction
$connection->beginTransaction();

try {
    // ... perform some queries ...
    // now commit to the database:
    $connection->commit();
} catch (Exception $e) {
    // there was an error, roll back the queries
    $connection->rollBack();
}

// at this point we are back in autocommit mode
{% endhighlight %}

## Manual Queries ##

You can, of course, build and issue your own queries by hand. Use the
`query()` method to do so:

{% highlight php %}
<?php
$text = "SELECT * FROM foo WHERE id = :id";
$bind = ['id' => 1];
$stmt = $connection->query($text, $bind);
{% endhighlight %}

The returned `$stmt` is a [PDOStatement](http://php.net/PDOStatement) that you
may manipulate as you wish.

## Profiling ##

You can use profiling to see how well your queries are performing.

{% highlight php %}
<?php
// turn on the profiler
$connection->getProfiler()->setActive(true);

// issue a query
$result = $connection->fetchAll('SELECT * FROM foo');

// now get the profiler information
foreach ($connection->getProfiler()->getProfiles() as $i => $profile) {
    echo 'Query #' . ($i + 1)
       . ' took ' . $profile->time . ' seconds.'
       . PHP_EOL;
}
{% endhighlight %}

Each profile object has these properties:

- `text`: (string) The text of the query.

- `time`: (float) The time, in seconds, for the query to finish.

- `data`: (array) Any data bound to the query.

- `trace`: (array) A [debug_backtrace](http://php.net/debug_backtrace) so
  you can tell where the query came from.
