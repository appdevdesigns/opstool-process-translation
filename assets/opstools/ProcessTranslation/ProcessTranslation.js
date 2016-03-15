steal(
// List your Page's dependencies here:
	'opstools/ProcessTranslation/ProcessTranslation.css',
	'site/labels/opstool-ProcessTranslation.js',
	function () {
		steal.import('opstools/ProcessTranslation/controllers/ProcessTranslation').then(function () {

		});
	}
	);