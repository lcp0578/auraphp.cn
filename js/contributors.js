$.getJSON('/contributors.json', function (data) {
    data = shuffleObjects(data);
    var contributors = '';
    var count = 0;
    $.each(data, function (index, value) {
        count ++;
        contributors += '<div class="span3 contributor">';
        contributors += '<div class="contributor_thumbnail">';
        contributors += '<a href="';
        contributors += value.html_url + '" >';
        contributors += '<img height="50" width="50" alt="';
        contributors += index + '" src="';
        contributors += value.avatar_url + '">';
        contributors += '</a></div>';
        contributors += '<a lang="en" rel="contact colleague" href="';
        contributors += value.html_url;
        contributors += '">' + value.name + '</a>';
        contributors += '</div>';
    });

    var preamble = '<p>We currently have '
        + count
        + ' contributors to the project.</p>';

    $('#contributors').html(preamble + contributors);
});

function shuffleObjects(objectList) {
    var keys = getKeys(objectList);
    var result = {};
    keys = shuffle(keys);
    for(var i=0; i < keys.length; i++) {
        result[keys[i]] = objectList[keys[i]];
    }
    return result;
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function getKeys(object) {
    if(Object.keys) {
        return Object.keys(object);
    }
    var keys = [];
    for(key in object) {
        keys.push(key);
    }
    return keys;
}
