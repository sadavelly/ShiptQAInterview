describe("Shipt Checkout Process", function(){

	var email = 'qatest@shipt.com';
	var password = 'Sh1pt123!';
	var searchItem = 'Yogurt';
    var categoryItem = 'Eggs';

    it("Access www.shipt.com in the browser", function(){
    	// Goto www.shipt.com
        browser.url('https://www.shipt.com');

        var title = browser.getTitle();
        console.log('Title is:' + title);

        var url = browser.getUrl();
        console.log('Url is:' + url);
    });

    it("Login using the given credentials", function(){

        //Click on the Login button
    	browser.waitForExist('a.button-secondary.right');
        browser.click('a.button-secondary.right');

        // Enter email and password
        browser.waitForExist('div input[placeholder="Email"]');
        browser.setValue('div input[placeholder="Email"]', email);
        browser.setValue('div input[placeholder="Password"]', password);

        // Submit by clicking login button
        browser.click('#start_shopping_login_button');

    });

    it("Use the search feature to find a product and add it to the cart", function(){
        
        // Wait for the search field, enter any search-item into the field and submit
        browser.waitForExist('#search');
        browser.setValue('#search', searchItem);
        browser.click('div button[type="submit"]');

        // Add the first item in the list
        browser.waitForExist('div:nth-child(1)[ng-repeat="product in searchResults"] button>i.ion-plus');
        browser.click('div:nth-child(1)[ng-repeat="product in searchResults"] button>i.ion-plus');
        
    });

    it("Use the category menu to find a product and it to the cart", function(){

        // Click on 'Shop by Category' and goto one of the categories
        browser.click('div>button[data-full-label="Shop by Category"]');

        browser.waitForVisible('div.list>ion-item:nth-child(7)');
        browser.click('div.list>ion-item:nth-child(7)');

        // Click on one of the sub-category 
        browser.waitForExist('div.side-category-menu.dark>div:nth-child(7)')

        // Add the first item in the list
        browser.waitForExist('div:nth-child(1)[ng-repeat="product in products"]')
        browser.click('div:nth-child(1)[ng-repeat="product in products"] button>i.ion-plus');

    });

    it("Validate that the correct products exist in the cart", function(){

        // Goto shopping cart page
        browser.url('https://shop.shipt.com/#/app/shoppingCart');

        // Get the name, quantity and price of the products added
        browser.waitForExist('div.cart-items-area>div>div:nth-child(2)');
        var expectedCategoryItem = browser.getText('div.cart-items-area>div>div:nth-child(2) p.product-name');
        var expectedCategoryItemQuantity = browser.getText('div.cart-items-area>div>div:nth-child(2) div.amt-buttons>span');
        var expectedCategoryItemPrice = browser.getText('div.cart-items-area>div>div:nth-child(2) p.price>span');

        //Assert that shop by category item added is correct
        expect(expectedCategoryItem, 'Category items do not match').to.include(categoryItem);

        var expectedSearchItem = browser.getText('div.cart-items-area>div>div:nth-child(3) p.product-name');
        var expectedSearchItemQuantity = browser.getText('div.cart-items-area>div>div:nth-child(3) div.amt-buttons>span');
        var expectedSearchItemPrice = browser.getText('div.cart-items-area>div>div:nth-child(3) p.price>span');
        
        //Assert that search item added is correct
        expect(expectedSearchItem, 'Search items do not match').to.include(searchItem);

        // Calculate the subtotal and compare it with the subtotal displayed on the page, this is to validate.
        var subtotal = parseFloat(expectedSearchItemPrice.substr(1, expectedSearchItemPrice.length)) * parseFloat(expectedSearchItemQuantity) + 
        parseFloat(expectedCategoryItemPrice.substr(1, expectedCategoryItemPrice.length)) * parseFloat(expectedCategoryItemQuantity);
        subtotal = subtotal.toFixed(2);

        var expectedSubtotal = browser.getText('div.sub-total-area div.text-right');
        expectedSubtotal = parseFloat(expectedSubtotal.substr(1, expectedSubtotal.length));
        expectedSubtotal = expectedSubtotal.toFixed(2);

        //Asserting that the calculated subtotal is the same as expectedSubtotal value
        expect(subtotal, 'Subtotals do not match').to.equal(expectedSubtotal);
        
    });
    
});
