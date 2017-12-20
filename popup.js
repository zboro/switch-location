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
		liNode.appendChild(createSwitchButton(rule));
		liNode.appendChild(createNewTabButton(rule));
		liNode.appendChild(createIncognitoButton(rule));
		rulesList.appendChild(liNode);
	}

	function createSwitchButton(rule) {
		var button = document.createElement("button");
		button.appendChild(document.createTextNode(rule.name));
		button.className = "switchButton";
		button.title = "Switch location";
		button.onclick = switchPage.bind(null, rule);
		return button;
	}

	function createNewTabButton(rule) {
		var button = document.createElement("button");
		button.className = "newTabBtn";
		button.innerHTML = "+";
		button.title = "Open in new tab";
		button.onclick = openNewTab.bind(null, rule);
		return button;
	}

	function createIncognitoButton(rule) {
		var button = document.createElement("button");
		button.className = "incognitoBtn";
		button.title = "Open in incognito";
		button.onclick = openIncognito.bind(null, rule);
		return button;
	}

	function switchPage(rule) {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			chrome.tabs.update(tabs[0].id, {
				url: tabs[0].url.replace(new RegExp(rule.pattern), rule.replacement)
			});
		});
	}

	function openNewTab(rule) {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			chrome.tabs.create({
				url: tabs[0].url.replace(new RegExp(rule.pattern), rule.replacement)
			});
		});
	}

	function openIncognito(rule) {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			chrome.windows.create({
				"url": tabs[0].url.replace(new RegExp(rule.pattern), rule.replacement),
				"incognito": true
			});
		});
	}

})();
