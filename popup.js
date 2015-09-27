(function() {
	var rulesList = document.getElementById("rulesList");

	displayRules();

	function displayRules() {
		loadRules(renderRules);
	}

	function loadRules(callback) {
		chrome.storage.sync.get("rules", callback);
	}

	function renderRules(settings) {
		var rules = settings.rules || [];
		rules.forEach(renderRule);
	}

	function renderRule(rule) {
		var liNode = document.createElement("li");
		var switchButton = createSwitchButton(rule);
		liNode.appendChild(switchButton);
		rulesList.appendChild(liNode);
	}

	function createSwitchButton(rule) {
		var button = document.createElement("button");
		button.appendChild(document.createTextNode(rule.name));
		button.onclick = switchPage.bind(null, rule);
		return button;
	}

	function switchPage(rule) {
		chrome.tabs.query({
			"active": true
		}, function(tabs) {
			chrome.tabs.update(tabs[0].id, {
				url: tabs[0].url.replace(new RegExp(rule.pattern), rule.replacement)
			});
		});
	}

})();
