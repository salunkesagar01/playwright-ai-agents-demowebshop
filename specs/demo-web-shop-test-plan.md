# Demo Web Shop Core End-User Flow Test Plan

## Application Overview

Explore and validate the ten core customer flows on https://demowebshop.tricentis.com/: registration, login/logout, search, category browsing, product details, add to cart, cart editing, wishlist, checkout, and order history. The storefront exposes account forms, category sorting/view/page-size controls, a Health Book detail page with quantity and add-to-cart/wishlist actions, cart quantity/removal and terms controls, guest checkout, and an authenticated orders page. Each scenario is independent and starts in a fresh browser context with an empty cart/wishlist; tests that need a customer use a newly created disposable account with a unique email address. Use valid fictitious customer/address data, and do not assume production payment credentials. Pass only when the stated state/messages/navigation and totals match; fail on missing validation, incorrect contents or totals, inaccessible protected data, or unintended state changes. Checkout steps and available methods may vary with the demo catalog/configuration; follow the options rendered by the site and stop before charging any external payment method.

## Test Scenarios

### 1. Registration

**Seed:** `tests/seed.spec.ts`

#### 1.1. Register a new customer with valid details

**File:** `tests/registration/register-success.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with no account for the unique test email. Open Register.
    - expect: The registration form is displayed.
  2. Enter a valid first name, last name, unique valid email, password meeting the site's rules, and the same value in Confirm password. Select a gender if desired, then submit Register.
    - expect: The account is created successfully and a registration-success confirmation is shown.
    - expect: The new customer's signed-in state is visible in the account navigation.

#### 1.2. Reject missing or malformed registration details

**File:** `tests/registration/register-validation.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context. Open Register and submit the form with all fields blank.
    - expect: The form stays on the registration page and displays required-field validation for the missing name, email, password, and confirmation.
  2. Enter a malformed email and a password that does not meet the site's minimum length; submit.
    - expect: The email and password are rejected with field-level validation; no account is created.

#### 1.3. Reject mismatched confirmation and duplicate email

**File:** `tests/registration/register-edge-cases.spec.ts`

**Steps:**
  1. Assumption: use a fresh context and a unique disposable email. Enter otherwise-valid registration data but use different password and confirmation values, then submit.
    - expect: A password-mismatch message is displayed and registration does not complete.
  2. Correct the confirmation and complete registration. Sign out, open Register again, and submit valid details using the already-registered email.
    - expect: The first registration succeeds.
    - expect: The second attempt is rejected as an already-registered email; no duplicate account is created.

### 2. Login and logout

**Seed:** `tests/seed.spec.ts`

#### 2.1. Sign in and sign out successfully

**File:** `tests/login-logout/login-success-logout.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with a valid disposable account already registered. Open Log in.
    - expect: Email and password fields and the Log in action are available.
  2. Enter the account's valid email and password and submit Log in.
    - expect: The user is signed in and the navigation shows the account identity and Log out action.
  3. Select Log out.
    - expect: The user is signed out and Register/Log in navigation is shown.

#### 2.2. Reject invalid login credentials

**File:** `tests/login-logout/login-invalid-credentials.spec.ts`

**Steps:**
  1. Assumption: use a fresh context and a registered test account. Open Log in, enter a valid-format email with an incorrect password, and submit.
    - expect: A clear invalid-credentials message is shown, the page remains unauthenticated, and no account-only page is exposed.

#### 2.3. Validate blank and malformed login inputs

**File:** `tests/login-logout/login-input-edge-cases.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context. Submit Log in with both fields blank.
    - expect: The form remains available and indicates required values or an unsuccessful login; no signed-in state appears.
  2. Enter a malformed email and any password, then submit.
    - expect: The malformed email is rejected or the login attempt fails with a clear message; no session is created.

### 3. Search

**Seed:** `tests/seed.spec.ts`

#### 3.1. Find a known product by keyword

**File:** `tests/search/search-known-product.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context. Use the store search for “Health Book” and submit.
    - expect: Search results include Health Book with a navigable product link.
  2. Open the Health Book result.
    - expect: The Health Book product detail page opens and the product name matches the result.

#### 3.2. Show a no-results response for an unmatched query

**File:** `tests/search/search-no-results.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context. Search for a distinctive string not present in the catalog, such as “zzq-no-such-product-93841”.
    - expect: The search page reports that no matching products were found and does not present unrelated results as a match.

#### 3.3. Handle empty, whitespace, and case-varied search terms

**File:** `tests/search/search-boundary-inputs.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context. Submit the search with the query empty, then with only spaces.
    - expect: The page handles each query without a server error or stale results; validation or an empty-query result is presented consistently.
  2. Search for “health book” using a different letter case from the product name.
    - expect: Search is case-insensitive or otherwise returns an explicit no-results state; the page remains usable.

### 4. Category browsing

**Seed:** `tests/seed.spec.ts`

#### 4.1. Browse from Books category to a product

**File:** `tests/category-browsing/category-navigation.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context. Select Books from the category navigation.
    - expect: The Books category page opens with a Books heading and product listings.
  2. Open Health Book from the listing.
    - expect: The product detail page opens and the breadcrumb identifies Books as its parent category.

#### 4.2. Sort and change the category product view

**File:** `tests/category-browsing/category-sort-and-view.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context on Books. Change sorting to Name: A to Z.
    - expect: The listing updates to alphabetical product order and the selected sort option remains visible.
  2. Switch between Grid and List view and change the page-size option to a supported value.
    - expect: Products remain available in the chosen presentation and page size; no product detail or category context is lost.

#### 4.3. Handle category page-size and pagination boundaries

**File:** `tests/category-browsing/category-empty-or-boundary.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context on a populated category. Select the smallest available page size and navigate to another page if pagination is present.
    - expect: The number of displayed products respects the selected page size and page navigation does not duplicate or omit items.
  2. Select the largest available page size, then use browser back to return to the category.
    - expect: The category remains valid and navigation returns to a usable listing without an error or broken state.

### 5. Product details

**Seed:** `tests/seed.spec.ts`

#### 5.1. Inspect complete product details

**File:** `tests/product-details/product-overview.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context. Open the Health Book product from Books.
    - expect: The detail page shows the Health Book name, description, availability, delivery information, price, quantity field, and product actions.
  2. Follow the product category breadcrumb back to Books.
    - expect: The Books category is opened and the navigation breadcrumb is usable.

#### 5.2. Open product review entry point

**File:** `tests/product-details/product-reviews.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context on Health Book. Select the review count or Add your review link.
    - expect: The review section or review form is reached, with required fields clearly indicated if a review submission is offered.
  2. Attempt to submit the review form with required values blank, if the form is available.
    - expect: The form does not accept an empty review and displays validation; no blank review is posted.

#### 5.3. Validate product quantity on details

**File:** `tests/product-details/product-quantity-edge.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context on a product detail page. Set quantity to 0 and attempt Add to cart.
    - expect: Zero is rejected or normalized according to the site's rules; an invalid quantity is not silently added as a valid item.
  2. Enter a non-numeric or negative quantity and try to continue.
    - expect: Invalid quantity is blocked or corrected with clear behavior; product details remain usable and no unintended quantity is added.

### 6. Add to cart

**Seed:** `tests/seed.spec.ts`

#### 6.1. Add one product to the cart

**File:** `tests/add-to-cart/add-single-product.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with an empty cart. Open Health Book, leave quantity at 1, and select Add to cart.
    - expect: A confirmation indicates Health Book was added to the shopping cart.
    - expect: The cart indicator increments to 1.
  2. Open Shopping cart.
    - expect: The cart contains one Health Book row with quantity 1 and the correct displayed price/line total.

#### 6.2. Add a specified quantity to cart

**File:** `tests/add-to-cart/add-multiple-quantity.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with an empty cart. On Health Book, set quantity to 2 and select Add to cart.
    - expect: The add confirmation appears and the cart contains two units, either as one row with quantity 2 or as the site's equivalent accurate representation.
  2. Open Shopping cart and compare item quantity and subtotal to the displayed unit price.
    - expect: The quantity and subtotal are correct and no duplicate unintended product is present.

#### 6.3. Add the same item repeatedly and preserve cart state

**File:** `tests/add-to-cart/add-repeat-and-cart-state.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with an empty cart. Add Health Book once, then add it again from the product page.
    - expect: Both add actions produce confirmation and cart quantity reflects two total units without dropping the first item.
  2. Navigate to another category and return to the cart.
    - expect: The cart contents persist during storefront navigation and the cart indicator matches its contents.

### 7. Edit cart

**Seed:** `tests/seed.spec.ts`

#### 7.1. Update cart quantity and totals

**File:** `tests/edit-cart/update-quantity.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with one Health Book in cart. Change its quantity from 1 to 3 and select Update shopping cart.
    - expect: The cart row updates to quantity 3 and line/subtotal totals recalculate using the current unit price.

#### 7.2. Remove a product from the cart

**File:** `tests/edit-cart/remove-product.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with at least one product in cart. Select its remove checkbox and click Update shopping cart.
    - expect: The selected item is removed, cart count and totals update, and the empty-cart message is shown when no other items remain.

#### 7.3. Reject invalid cart quantities

**File:** `tests/edit-cart/invalid-quantity.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with one product in cart. Set quantity to 0 and update the cart.
    - expect: The zero quantity is handled according to the site's validation/removal rules; totals and cart count remain consistent.
  2. Set quantity to a negative number or non-numeric text and update.
    - expect: Invalid input is rejected or safely corrected with clear feedback; no negative line total or corrupted cart state appears.

### 8. Wishlist

**Seed:** `tests/seed.spec.ts`

#### 8.1. Add a product to wishlist

**File:** `tests/wishlist/add-product.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with an empty wishlist. Open Health Book and select Add to wishlist.
    - expect: A confirmation indicates the product was added to the wishlist and the wishlist indicator increments.
  2. Open Wishlist.
    - expect: Wishlist contains Health Book with the correct product link and displayed price.

#### 8.2. Remove wishlist item and verify empty state

**File:** `tests/wishlist/remove-and-empty.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with one product in wishlist. Select the remove control and update the wishlist if required.
    - expect: The item is removed and the wishlist indicator and contents are updated.
  2. Open Wishlist after removing the last item.
    - expect: The page presents the empty wishlist message and no stale product row.

#### 8.3. Update wishlist quantity and move item to cart

**File:** `tests/wishlist/quantity-and-move-to-cart.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with Health Book in wishlist. Set wishlist quantity to 2 and select Add to cart.
    - expect: The product is added to the cart with the requested quantity and the wishlist remains unchanged unless the UI explicitly documents removal.
  2. Review cart and wishlist indicators and contents.
    - expect: Cart and wishlist reflect their respective item state without accidental duplication or loss.

### 9. Checkout

**Seed:** `tests/seed.spec.ts`

#### 9.1. Complete a valid guest checkout

**File:** `tests/checkout/guest-checkout-success.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with one in-stock product in the cart and valid fictitious customer/address data. On Shopping cart, select Checkout without agreeing to terms.
    - expect: Checkout is blocked and a Terms of service prompt asks the user to accept before continuing.
  2. Accept terms, select Checkout, choose Checkout as Guest, and complete the required billing address fields with valid data.
    - expect: The one-page checkout opens and advances from Billing address after valid data is submitted.
  3. Complete the rendered shipping address, shipping method, payment method, and payment-information steps using available demo-safe options; review the confirmation summary and confirm the order.
    - expect: Checkout advances through its six displayed steps without validation errors.
    - expect: The order confirmation is shown with an order number, correct item, quantity, and total; no external payment is charged.

#### 9.2. Prevent checkout with missing or invalid required data

**File:** `tests/checkout/checkout-validation.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with a product in cart. Accept terms, proceed as guest, and try to continue billing with required fields blank.
    - expect: Billing validation identifies required fields and checkout does not advance.
  2. Enter a malformed email or incomplete address and try again.
    - expect: Invalid values are rejected with actionable validation and no order is submitted.

#### 9.3. Handle unavailable checkout options and cancellation safely

**File:** `tests/checkout/checkout-boundary-and-cancel.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with one product in cart and valid data. Continue through checkout and inspect shipping/payment choices presented by the site.
    - expect: At least one available option is selectable when checkout can proceed; unavailable options are not selectable and do not permit premature confirmation.
  2. Use browser back or return to cart before confirming the order.
    - expect: No order is created, the cart retains its items and quantities, and the customer can resume or restart checkout.

### 10. Order history

**Seed:** `tests/seed.spec.ts`

#### 10.1. View order history for an account with an order

**File:** `tests/order-history/order-list.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with a disposable account that has completed at least one valid order. Sign in and open Orders from My account.
    - expect: The order-history page is accessible and lists the completed order with its order number, date, status, and total.
  2. Open the listed order details.
    - expect: The detail view matches the order header and shows the purchased products, quantities, billing/shipping summary, and totals.

#### 10.2. Show empty history for a new customer

**File:** `tests/order-history/no-orders.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context with a newly registered account that has never placed an order. Sign in and open Orders.
    - expect: The account is authorized to view order history and the page displays the empty/no-orders state rather than a failure or another customer's data.

#### 10.3. Require authentication and isolate order history

**File:** `tests/order-history/unauthorized-and-isolation.spec.ts`

**Steps:**
  1. Assumption: start in a fresh browser context signed out. Navigate directly to /customer/orders.
    - expect: The user is redirected to login or otherwise required to authenticate; order data is not exposed.
  2. Sign in as a different disposable account with no orders and open Orders.
    - expect: Only the signed-in account's empty history is displayed; another account's orders are not visible.
