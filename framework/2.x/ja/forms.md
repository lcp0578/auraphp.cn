---
layout: docs2-ja
title: フォーム
permalink: /framework/2.x/ja/forms/
previous_page: ビュー
previous_page_url: /framework/2.x/ja/view/
next_page: バリデーション
next_page_url: /framework/2.x/ja/validation/
---

# フォーム

フォームはWebアプリケーションに欠かせない要素です。composer.json に`foa/filter-input-bundle` と `foa/filter-input-bundle` を追加してください。

{% highlight json %}
{
    // more
    "require": {
        // more
        "foa/filter-input-bundle": "~1.1",
        "foa/filter-intl-bundle": "~1.1"
    }
}
{% endhighlight %}

## 使い方

フォームを作るためには`Aura\Input\Form`クラスを拡張し、initメソッドをオーバーライドします。

以下に例を示します。

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/src/App/Input/ContactForm.php
 */
namespace App\Input;

use Aura\Input\Form;

class ContactForm extends Form
{
    public function init()
    {
        $states = array(
            'AL' => 'Alabama',
            'AK' => 'Alaska',
            'AZ' => 'Arizona',
            'AR' => 'Arkansas',
            // ...
        );
        // すべてのフィールド名が一つの配列としてセットアップされるようにします。そうすることですべてのフィールドの値を$_POST['contact']で取得することができます。
        $this->setName('contact');
        // inputフィールドを設定します。
        // first_nameフィールドは、sizeとmaxlength属性を持つinput text として扱うようにビューレイヤーに知らせます。
        $this->setField('first_name', 'text')
            ->setAttribs(array(
                'id' => 'first_name',
                'size' => 20,
                'maxlength' => 20,
            ));

        // stateフィールドは、特定のオプション属性を持ったselectとして扱うようにビューレイヤーに知らせます(配列のキーがオプションのvalueとなり、配列の値が表示テキストになります)。
        $this->setField('state', 'select')
            ->setAttribs(array(
                 'id' => 'state',
            ))
            ->setOptions($states);

        $this->setField('message', 'textarea')
            ->setAttribs([
                'id' => 'message',
                'cols' => 40,
                'rows' => 5,
            ]);
        // etc.

        // フィルタオブジェクトを取得します。
        $filter = $this->getFilter();
        // フィルタをセットします。
        $filter->addSoftRule('first_name', $filter::IS, 'string');
        $filter->addSoftRule('first_name', $filter::IS, 'strlenMin', 4);
        $filter->addSoftRule('state', $filter::IS, 'inKeys', array_keys($states));
        $filter->addSoftRule('message', $filter::IS, 'string');
        $filter->addSoftRule('message', $filter::IS, 'strlenMin', 6);
    }
}
{% endhighlight %}

> Note : input, intl, filterはv1のコンポーネントを使用しています。

## 設定

`App\Input\ContactForm`を使うクラスのコンストラクタでタイプヒントを指定している場合、依存を注入するために[di](/framework/2.x/ja/di/)を使用するのはとても賢明なやり方です。

また、下記のようにすることもできます。

{% highlight php %}
$di->params['Vendor\Package\SomeDomain']['contact_form'] = $di->lazyNew('App\Input\ContactForm');
{% endhighlight %}

## 値の設定

`fill()`メソッドを使用してフォームの値を集めます。

{% highlight php %}
$this->contact_form->fill($_POST['contact']);
{% endhighlight %}

> このメソッドはAuraの文脈では[$this->request->post->get()](/framework/2.x/ja/request/)に相当します。

## ユーザー入力のバリデーション

`filter()`メソッドを使用してフォームのバリデーションを行えます。

{% highlight php %}
// フィルタを適用します。
$pass = $this->contact_form->filter();

// すべてのフィルタをパスしましたか?
if ($pass) {
    // はい、入力値は妥当です。
} else {
    // いいえ、入力値は妥当ではありません。
}
{% endhighlight %}

## レンダリング

`ContactForm`オブジェクトを渡したと仮定すると、ビューにアサインされる変数名は`contact_form`となります。フィールドの付属情報を取得するために、フォームオブジェクトの`get`メソッドが使用でき、取得した値をそのままinputヘルパーに渡すことができます。

例を下記に示します :

{% highlight php %}
echo $this->input($this->contact_form->get('first_name'));
{% endhighlight %}
