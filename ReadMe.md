# NSS Client Side Capstone: "Guitar-Pricer"

### Specs:
> Create a Browser Rich Application that utilizes the following:

1. AngularJs
1. Firebase Authentication and Database
1. Culmination of technologies mastered in last 6 months
 * HTML5
 * CSS
 * JavaScript

 ### Technologies Used:
> 1. HTML5, CSS, CSS Grid, JavaScript, Font Awesome, Google Fonts
> 2. [Angular 1.6.7](https://angularjs.org/): Core app functionality
> 3. [Angular Route 1.6.7](https://docs.angularjs.org/api/ngRoute): App navigation
> 4. [Angular Animate 1.6.7](https://docs.angularjs.org/api/ngAnimate): ng-repeat fade-ins
> 5. [Firebase 4.8.0](https://www.firebase.com/): Authentication, storage of user guitars
> 9. [Ebay API](https://developer.ebay.com/): Used to gather data on recent sales for the guitar the user searches for or stores for price tracking. 

### Final Result:
##### "Guitar Pricing App" gathers price information for used and vintage guitars based on recent market transactions
> Users may visit the site and perform basic and advanced searches to gather general or detailed price information on a guitar. 

> Users may create an account, save a guitar in their account, and track its value. Everytime the user logs in or visits their guitar collection new prices based on the most recent sales will be displayed.

> A user may store as many guitars as they like, and track them all simultaneously. The User may also delete guitars from their collection.


### Basic search pages. 
##### If a user is logged in, a seperate nav bar is generated with more options for user activity.
<kbd>
    <img    src="https://raw.githubusercontent.com/Gward2489/guitarPricer/master/grabs/gp3.png"    width="800">
</kbd>

<kbd>
    <img    src="https://raw.githubusercontent.com/Gward2489/guitarPricer/master/grabs/gp1.png"    width="800">
</kbd>

### Basic search results. 
##### Custom Javascript functions filter out results from ebay, and then generate average prices and standard deviation. User is given three prices representing the price range, as well as the amount of results returned by ebay. If there is only one search Result, ng-if is utilized to display only a single price. If there are no results, a javascript alert tells the user there are no results for their search. 

<kbd>
    <img    src="https://raw.githubusercontent.com/Gward2489/guitarPricer/master/grabs/gp2.png"    width="800">
</kbd>

### Log In/Registration Form.
<kbd>
    <img    src="https://raw.githubusercontent.com/Gward2489/guitarPricer/master/grabs/gp4.png"    width="800">
</kbd>

### Advanced Search
##### Customized angular and vanilla javascript are used in conjuction with css grid to generate an advanced search form. The search form takes the user input, filters it with custom javascript, and produces a string containing unique category references and detailed keywords to be passed into the ebay API call.

<kbd>
    <img    src="https://raw.githubusercontent.com/Gward2489/guitarPricer/master/grabs/gp8.png"    width="800">
</kbd>

### Advanced Search Results
##### Customized angular and vailla javascript are used to parse the data object returned by the ebay API call. The results are passed into multiple functions to obtain averages and standard deviation for different sub-categories of the guitar. The number of results for each sub-category is displayed along with high and low prices. using ng-if, angular will tell the user if there is only one result for any given sub-category, and exclude the high and low prices if so. If there are no results for the sub-category, ng-if is used to tell the user there are no results matching their search.
<kbd>
    <img    src="https://raw.githubusercontent.com/Gward2489/guitarPricer/master/grabs/gp9.png"    width="800">
</kbd>

### User Guitar Submission
##### Angular and vanilla javascript are used to create an object holding all the data required to perform an advanced search for the given guitar. The object is sent to firebase and stored in the user's collection of guitars on submission. After submission, the user is routed to their current collection.
<kbd>
    <img    src="https://raw.githubusercontent.com/Gward2489/guitarPricer/master/grabs/gp10.png" width="800">
</kbd>

### User Guitar Display
##### Angular and css grid are used to render the user's guitar collection in rows of three. The guitar's title is displayed, along with all available price information for the guitar. If a single result or no results are found for a users guitar, ng-if is employed to display the proper data. The user may also click on one of three buttons to view either average price info, high price info, or low price info.
<kbd>
    <img    src="https://raw.githubusercontent.com/Gward2489/guitarPricer/master/grabs/gp5.png"    width="800">
</kbd>

##### if there are high or low prices found for some categories and not others, ng-if is used to display the proper data
<kbd>
    <img    src="https://raw.githubusercontent.com/Gward2489/guitarPricer/master/grabs/gp6.png"    width="800">
</kbd>
<kbd>
    <img    src="https://raw.githubusercontent.com/Gward2489/guitarPricer/master/grabs/gp7.png"    width="800">
</kbd>