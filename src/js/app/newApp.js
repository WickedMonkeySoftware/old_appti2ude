// Generated by CoffeeScript 1.7.1

/*
  Get Search results from the parameter and build the model
 */

(function() {
  App.SearchResultsRoute = Em.Route.extend({
    model: function(params) {
      console.log(params);
      return this.getResults(params.search_term);
    },
    setupController: function(controller, model) {
      console.log("Model set");
      return controller.set("model", model);
    },
    getResults: function(terms) {
      console.log(terms);
      if ((terms == null) || terms === "undefined") {
        return [];
      } else {
        return $.ajax({
          url: "https://itunes.apple.com/search",
          data: {
            term: terms.replace(/%20/g, '+'),
            country: "US",
            media: "software",
            limit: "5"
          },
          dataType: "jsonp",
          cache: true
        }).then(function(data) {
          return data.results;
        });
      }
    }
  });


  /*
    Handle search submissions
   */

  App.SearchController = Em.Controller.extend({
    actions: {
      submit: function() {
        console.log(this.get("searchTerm"));
        return this.transitionToRoute("search.results", encodeURIComponent(this.get("searchTerm")));
      }
    }
  });


  /*
    Handle the displaying of the results
   */

  App.SearchResultsController = Em.ArrayController.extend({
    needs: "search",
    itemController: "searchResult",
    numberResults: (function() {
      return this.get("length");
    }).property("length"),
    actions: {
      select: function(id) {
        var item, selected, selection, _i, _j, _len, _len1;
        selected = this.filter(function(result) {
          return result.get("isSelected") === true;
        });
        for (_i = 0, _len = selected.length; _i < _len; _i++) {
          item = selected[_i];
          item.set("isSelected", false);
        }
        selection = this.filter(function(result) {
          return result.get("bundleId") === id;
        });
        for (_j = 0, _len1 = selection.length; _j < _len1; _j++) {
          item = selection[_j];
          item.set("isSelected", true);
        }
        if (selection.length > 0) {
          this.set("hasSelection", true);
        } else {
          this.set("hasSelection", false);
        }
        return this.set("selectedBundleId", id);
      }
    }
  });


  /*
    Individual search results
   */

  App.SearchResultController = Em.ObjectController.extend({
    shortDescription: (function() {
      return "" + (this.get("description").substring(0, 256)) + " [...]";
    }).property("description"),
    style: (function() {
      if (this.get("isSelected")) {
        return "list-group-item active";
      } else {
        return "list-group-item";
      }
    }).property("isSelected")
  });


  /*
    Create a new app, if it doesn't already exist
   */

  App.NewRoute = Em.AuthenticatedRoute.extend({
    model: function(params) {
      return this.getResults(params.id).then((function(_this) {
        return function(data) {
          if (data == null) {
            console.log("FIAL");
            return _this.transitionTo("index");
          } else {
            return {
              title: data.trackTitle,
              bundle: data.bundleId
            };
          }
        };
      })(this));
    },
    getResults: function(terms) {
      if ((terms == null) || terms === "undefined") {
        return [];
      } else {
        return $.ajax({
          url: "https://itunes.apple.com/lookup",
          data: {
            bundleId: terms,
            country: "US",
            media: "software",
            limit: "5"
          },
          dataType: "jsonp",
          cache: false
        }).then(function(data) {
          return data.results[0];
        });
      }
    },
    beforeModel: function(transition, params) {}
  });

  App.NewController = Em.ObjectController.extend({
    actions: {
      search: function() {}
    },
    searchTermUrl: (function() {
      return encodeURIComponent(this.get("searchTerm"));
    }).property("searchTerm"),
    numberResults: (function() {
      return this.get("length");
    }).property("@length")
  });

}).call(this);

//# sourceMappingURL=newApp.map
