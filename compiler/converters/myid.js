module.exports = function(file) {

	return [

		// loop.function
		['{{ loop.index }}', '<?= $this->array->index ?>'],
		['loop.index0', '$this->array->index'],
		['loop.index', '$this->array->index + 1'],
		['loop.last', 'count($this->array) == $this->array->index'],
		['loop.first', '$this->array->index == 0'],
		['+ 1 + 1', '+ 2'],
		['loop.length', 'count($this->array)'],
		['(not ', '(!'],
		[/([a-zA-Z0-9\[\]_]*)\.indexOf\(["|']([a-zA-Z0-9\[\]_]*)["|']\) \> -1/g, "strpos($$$1, '$2') !== FALSE"],

		// {% block content %}{% endblock %}
		['{% block content %}{% endblock %}', '<?php print $content ?>'],

		// {% block content %}<code />{% endblock %}
		[/\{\% block content \%\}([\s\S]*)\{\% endblock \%\}/g, '<!-- Content :: Template injected -->' + '$1'],

		// {% for a in b %}
		[/\{\% for ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*))(?:\.([a-zA-Z0-9\[\]_]*)) \%\}/g, '<?php foreach($$$2->$3->$4 as $$$1): ?>'],
		[/\{\% for ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*)) \%\}/g, '<?php foreach($$$2->$3 as $$$1): ?>'],
		[/\{\% for ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*) \%\}/g, '<?php foreach($$$2 as $$$1): ?>'],

		// {% for a, b in b %}
		[/\{\% for ([a-zA-Z0-9\[\]_]*), ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*))(?:\.([a-zA-Z0-9\[\]_]*)) \%\}/g, '<?php foreach($$$3->$4->$5 as $$$1 => $$$2): ?>'],
		[/\{\% for ([a-zA-Z0-9\[\]_]*), ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*)) \%\}/g, '<?php foreach($$$3->$4 as $$$1 => $$$2): ?>'],
		[/\{\% for ([a-zA-Z0-9\[\]_]*), ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*) \%\}/g, '<?php foreach($$$3 as $$$1 => $$$2): ?>'],

		// {% endfor %}
		['{% endfor %}', '<?php endforeach; ?>'],

		// {{ a.b.c }}
		[/\{\{ loop.([^~]*?) \}\}/g, '<?= loop.$1 ?>'],
		[/\{\{ ([a-zA-Z0-9\[\]_]*) \}\}/g, '<?= $$$1 ?>'],
		[/\{\{ ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*)) \}\}/g, '<?= $$$1->$2 ?>'],
		[/\{\{ ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*))(?:\.([a-zA-Z0-9\[\]_]*)) \}\}/g, '<?= $$$1->$2->$3 ?>'],
		[/\{\{ ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*))(?:\.([a-zA-Z0-9\[\]_]*))(?:\.([a-zA-Z0-9\[\]_]*)) \}\}/g, '<?= $$$1->$2->$3->$4 ?>'],

		// {% if condition %}
		//[ /\{\% if \(([a-zA-Z0-9\[\]_\-\>]*) (==|not|or) ([0-9]*?)\) \%\}/g, '<?php if ($$$1 $2 $3): ?>' ], // number
		//[ /\{\% if \(([a-zA-Z0-9\[\]_\-\>]*) (==|not|or) ((false|true)*)\) \%\}/g, '<?php if ($$$1 $2 $3): ?>' ], // boolean
		//[ /\{\% if \(([a-zA-Z0-9\[\]_\-\>]*) (==|not|or) ['|"](.*)['|"]\) \%\}/g, '<?php if ($$$1 $2 "$3"): ?>' ], // value
		//[ /\{\% if \(([a-zA-Z0-9\[\]_\-\>]*) (==|not|or) (.*)\) \%\}/g, '<?php if ($$$1 $2 $$$3): ?>' ], // variable
		[/\{\% if \(([a-zA-Z0-9\[\]_]*) ([^~]*?)\) \%\}/g, '<?php if ($$$1 $2): ?>'],
		[/\{\% if \(([a-zA-Z0-9\[\]_]*)\.((?:[a-zA-Z0-9\[\]_])* )([^~]*?)\) \%\}/g, '<?php if ($$$1->$2$3): ?>'],
		[/\{\% if \(([^~]*?)\) \%\}/g, '<?php if ($1): ?>'],

		// {% elif condition %}
		[/\{\% elif \(([a-zA-Z0-9\[\]_]*) ([^~]*?)\) \%\}/g, '<?php elseif ($$$1 $2): ?>'],
		[/\{\% elif \(([a-zA-Z0-9\[\]_]*)\.((?:[a-zA-Z0-9\[\]_])* )([^~]*?)\) \%\}/g, '<?php elseif ($$$1->$2$3): ?>'],
		[/\{\% elif \(([^~]*?)\) \%\}/g, '<?php elseif ($1): ?>'],

		// {% else %}
		['{% else %}', '<?php else: ?>'],

		// {% endif %}
		['{% endif %}', '<?php endif; ?>'],

		// $main->
		['$main->', '$template->'],

		// $pageName->
		['$' + file.replace(/\.[^/.]+$/, '') + '->', '$'],

		// {% macro macro() %}
		[/\{\% macro ([^~]*?)\%\}(((\r*)(\n*))*)/g, ''],
		['{% endmacro %}', ''],

		// {{ macro.hero() }}
		[/\{\{ macro([^~]*?)\}\}(\r\n){0,1}/g, ''],

		// {% extends "page.html" %}
		[/\{\% extends ([^~]*?)\%\}(((\r*)(\n*))*)/g, ''],

		// {% raw %}<code />{% endraw %}
		[/\{\% raw \%\}([^~]*?)\{\% endraw \%\}/g, '$1'],

		// {% include "component.html" %}
		[/\{\% include ["|']([a-zA-Z0-9\[\]_/]*).(.*)["|'] \%\}/g, '<?php $this->load->view(\'$1\'); ?>'],

		// {% import "components" as macro %}
		[/\{\% import ["|']([a-zA-Z0-9\[\]_/]*).(.*)["|'] as ([a-zA-Z0-9_]*) \%\}/g, '<?php $this->load->view(\'$1\'); ?>'],

		// {{ 'link-to-asset' | asset }}
		[/\{\{ ["|'](.*)["|'] \| asset \}\}/g, '<?= site_url(\'assets/$1\') ?>'],

		// {{ something.something | replace('a', 'b') }}
		[/\{\{ ([a-zA-Z0-9\[\]_]*)\.([a-zA-Z0-9\[\]_]*) \| replace\(['|"](.*)['|"], ['|"](.*)['|"]\) \}\}/g, '<?= str_replace(\'$3\', \'$4\', $$$1->$2) ?>'],

		// <title></title>
		[/\<title\>(.*)\<\/title\>(\r\n)/g, ''],
		[/\<\!\-\- Title \-\-\>(\r\n){1,}/g, ''],

		// <meta name="description">
		[/\<meta(.*)description([^~]*?)\>(\r\n)(\r\n)/g, ''],

		// MyID $template requirements
		['</head>', "\t" + '<!-- myID -->' + "\n\t" + '<?php' + "\n\t\t" + 'print $template->get_meta();' + "\n\t\t" + 'print $template->get_css();' + "\n\t" + '?>' + "\n\n" + '</head>'],
		['</body>', "\t" + '<!-- myID -->' + "\n\t" + '<?php' + "\n\t\t" + 'print $template->get_scripts();' + "\n\t\t" + 'print $template->google_tracker();' + "\n\t" + '?>' + "\n\n" + '</body>']

	];

};