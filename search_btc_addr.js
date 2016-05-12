(function () {
  function search_node(n) {
	console.assert(n.nodeType == 3, n);
    console.log(n.nodeValue);
	// TODO...
	// Both insertion and removal of an address must be considered...
  };

  var non_script_filter = { acceptNode: function(node) {
	var p = node.parentNode;
	if(p && p.nodeType == 1 /* ELEMENT_NODE */) {
		if(p.nodeName == "SCRIPT") {
			return NodeFilter.FILTER_REJECT;
		}
		return NodeFilter.FILTER_ACCEPT;
	}
	return NodeFilter.FILTER_REJECT;
  }};

  function search_from_node(par_node) {
	  var w = document.createTreeWalker(par_node,
		NodeFilter.SHOW_TEXT, non_script_filter);
	  var n;
	  while(n = w.nextNode()) {
		  search_node(n);
	  }
  };

  function mutation_handler(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.type == "characterData") {
        var n = mutation.target;
        if(n.nodeType == 3 /* TEXT_NODE */) {
          search_node(n);
        }
      } else if(mutation.type == "childList") { // Mutation type can only be "childList"
        var added = mutation.addedNodes;
        for(var i = 0; i < added.length; ++i) {
          search_from_node(added[i]);
		}
	  }
	});
  };

  var observer = new MutationObserver(mutation_handler);

  var config = {
    childList: true,
    attributes: false,
    characterData: true,
    subtree: true
  };
  observer.observe(document.body, config);

  search_from_node(document.body);
})();
