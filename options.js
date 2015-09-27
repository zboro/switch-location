(function() {
	var newRuleForm = document.getElementById("newRuleForm");
	var rulesFormSubmitBtn = document.getElementById("rulesFormSubmitBtn");
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
		var nameNode = createEditNode("name", rule);
		var patternNode = createEditNode("pattern", rule);
		var replacementNode = createEditNode("replacement", rule);
		var deleteNode = createDeleteNode(rule, row);
		row.appendChild(nameNode);
		row.appendChild(patternNode);
		row.appendChild(replacementNode);
		row.appendChild(deleteNode);
		rulesTableBody.insertBefore(row, newRuleRow);
	}

	function createEditNode(propertyName, rule) {
		var node = document.createElement("td");
		var input = document.createElement("input");
		input.required = true;
		input.value = rule[propertyName];
		input.onchange = updateValue.bind(input, propertyName, rule);
		node.appendChild(input);
		return node;
	}

	function updateValue(propertyName, rule) {
		rule[propertyName] = this.value;
		var isValid = this.checkValidity();
		if (!isValid) {
			setTimeout(function() { //message will disappear immediately without this
				rulesFormSubmitBtn.click(); //this will only trigger form validation, it will not submit form
			}, 0);
			return;
		}
		rule[propertyName] = this.value;
		saveRules();
	}

	function createDeleteNode(rule, row) {
		var node = document.createElement("td");
		var delBtn = document.createElement("button");
		delBtn.title = "Delete";
        delBtn.className = "deleteRuleBtn";
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
