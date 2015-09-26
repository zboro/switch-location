(function() {
	var newRuleForm = document.getElementById("newRuleForm");
	var rulesTableBody = document.getElementById("rulesTableBody");
	var newRuleRow = document.getElementById("newRuleRow");
	var newRuleName = document.getElementById("ruleName");
	var newPattern = document.getElementById("pattern");
	var newReplacement = document.getElementById("replacement");
	var rules;

	newRuleForm.addEventListener("submit", addRule);

	loadRules();

	function addRule(evt) {
		evt.preventDefault();
		evt.stopPropagation();

		var rule = {
			name: newRuleName.value,
			pattern: newPattern.value,
			replacement: newReplacement.value
		};
		rules.push(rule);
		saveRules();
		renderRuleRow(rule);
		newRuleForm.reset();
		newPattern.focus();
	}

	function loadRules() {
		clearTable();
		chrome.storage.sync.get("rules", function(settings) {
			rules = settings.rules || [];
			rules.forEach(renderRuleRow);
		});
	}

	function clearTable() {
		Array.prototype.forEach.call(rulesTableBody.children, function(row) {
			if (row === newRuleRow) {
				return;
			}
			rulesTableBody.removeChild(row);
		});
	}

	function renderRuleRow(rule) {
		var row = document.createElement("tr");
		var nameNode = createTextNode(rule.name);
		var patternNode = createTextNode(rule.pattern);
		var replacementNode = createTextNode(rule.replacement);
		var deleteNode = createDeleteNode(rule, row);
		row.appendChild(nameNode);
		row.appendChild(patternNode);
		row.appendChild(replacementNode);
		row.appendChild(deleteNode);
		rulesTableBody.insertBefore(row, newRuleRow);
	}

	function createTextNode(text) {
		var node = document.createElement("td");
		node.appendChild(document.createTextNode(text));
		return node;
	}

	function createDeleteNode(rule, row) {
		var node = document.createElement("td");
		var delBtn = document.createElement("button");
		delBtn.innerHTML = "Delete";
		delBtn.onclick = deleteRule.bind(null, rule, row);
		node.appendChild(delBtn);
		return node;
	}

	function deleteRule(rule, row) {
		var index = rules.indexOf(rule);
		rules.splice(index, 1);
		rulesTableBody.removeChild(row);
		saveRules();
	}

	function saveRules() {
		chrome.storage.sync.set({
			rules: rules
		});
	}
})();
