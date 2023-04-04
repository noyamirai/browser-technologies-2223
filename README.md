# Web Development Wars

For the course "Browser Technologies" we were tasked to look into what Progressive Enhancement is and how we can apply it to create good and accessible websites. The web is for everyone, and for our assignement we learned how to ensure that.

There were several user stories we could pick from. The one I picked was called "Survey about the Web Development minor", see full user story below:

> I want to be able to fill out a survey about the Web Development minor, with various answer options. I want to clearly see where I am and how much I still have to do. I want to be able to review previously filled in questions. If I can't finish the survey, I want to be able to continue later from where I left off.

## :bulb: Core features

To be able to ensure everyone in every context is able to fill out the survey, we need to define the core features. Obviously, students need to be able to submit a form containing questions about the minor. But there are a few other features/requirements needed:

- Login with name, email, studentnumber
- Anonymous mode option
- Show course teachers
- Show course dates
- Submit a survey for each course within the minor
- Revision course survey submissions
- See total survey progress

Besides these core features, I wanted to add a bit of *fun* to the assignment. So I change it from a 'normal' survey to a more gamificationalized(?) survey, based on the concept of eiher rewarding students for valuable feedback (rated by teachers) or speed in which students fill out the first course survey. Once all course surveys are filled out, students would be shown a leaderboard consisting all other students who finished the surveys. I did not really put much thought into this gamification survey, since the core features are being able to fill out a survey, and there was not a lot of time either.

## :art: Quick design

At first, I wanted to kind of freestyle my way through the UI as I got started with the HTML structure. Once it was time to add CSS I felt stuck. I just HAD to make a quick design to establish the overall look and feel of the site.

![Web Dev Wars Design]('./assets/web_dev_wars-preview.png')

## :rainbow: Progressive Enhancement

I applied progressive enhancement 'over time'. As mentioned before, I  first started with setting up a solid HTML structure and tried to make sure to keep everything semantic. Without any CSS or Javascript the site should still be able to work, which it does. Thanks to HTML client-side form validation is possible to a certain extent (pattern checking and required fields). Other validations would have to be done via the server.

After creating the design and HTML structure, I added responsive styling. I (of course) started with mobile/small screens and used media queries for bigger screens when necessary. The next step was to add some Javascript. I do want to note that I used a bit more Javascript than needed for demo purposes (for example: saving data in localstorage). Other than that all I really added as part of 'enhancement' in regards of Javascript was field validation on the login page. Based on patterns or whether or not a field is empty, I display/hide feedback labels. I chose not to make them scream error messages or make them red, instead I wanted to keep the overal playful energy by using one of the main colors and incorporating 'friendly' feedback.

![Web Dev Wars Feedback]('./assets/web_dev_wars-preview-feedback.png');

I also designed my website to be functional without need of Javascript. One of the core requirements was that students should be able to revision their survey answers. By separating course surveys into their own different form pages, I did not have to battle to save progress in localstorage for example. Each time a student wants to save a single or multiple survey answers, they have to submit a form. This means the form submission would get send to the server, which then gets saved in a database. Then, with help of server-side rendering, next time the student navigates to said course survey, the server can define which of the answers they have already answered by fetching the necessary data from the respective database.

## Feature Detection

To ensure **everyone** is able to experience the best user experience in any type of context, I made use of feature detection. For example, in Javascript whenever I have to do something that involves localstorage, I call this function:

```js
// SOURCE: https://stackoverflow.com/questions/32902659/detect-if-browser-allows-setting-localstorage-setitem
supports_html5_storage() {
    try {
        if ('localStorage' in window && window['localStorage'] !== null) {
            localStorage.setItem("testitem",true);
            localStorage.getItem("testitem");
            localStorage.removeItem("testitem");
            return true;
        }
    } catch (e) {
        return false;
    }
}
```

This function not only checks if localstorage is supported, but if it also *actually* works. If it doesn't work, my app won't break, it will just not use localstorage! Another feature detection I used was in CSS. For example, my animations will only be active when the user has no preferences set in regards of reduced motion:

```css
@media only screen and (min-width: 900px) and (prefers-reduced-motion: no-preference ) {
    .floating {
        transform: translate(0,0); /* Set the initial position of the box */
        transition: transform 1s ease-in-out; /* Add a transition effect */
        animation: floating 2.5s infinite; /* Add a continuous animation */
    }

    .floating:nth-of-type(odd) {
        animation: floating 2.5s -1.5s infinite; /* Add a continuous animation */
    }
}
```

## :eye: Accessibility

To ensure accessibility, I went through my website with the "Color Contrast Analyser". This analyser allowed me to use a color picker and select fore- and background colors to show the contrast ratio. As seen in the results below, the contrast ratio of my text components all meet the required measurements, and the UI contrast meet mostly the UI requirements:

![Web Dev Wars - Color Contrast]('./assets/web_dev_wars-color_contrast_analyzer.png')

Besides color contrast, I also made sure the site was navigatable via keyboard (tab usage) and that the user clearly sees which fields/links are currently focused. For screenreaders I added a few `aria-hidden` attributes to make sure it does not read visual elements in text such as `{}`.

## :globe_with_meridians: Tested browsers

| Browser (Desktop) | Passed                   |
|--------------------|---------------------------------|
| Chrome              | :white_check_mark:                   |
| Firefox      | :white_check_mark: |
| Safari   | :white_check_mark:    |
| Flow     | the best it can                    |

| Browser (Mobile) | Passed                   |
|--------------------|---------------------------------|
| Safari              | :white_check_mark:                   |
| Samsung Internet      | :white_check_mark: |
| UC Browser   | :white_check_mark:    |
| Chrome     | :white_check_mark:                    |

### :mag_right: Flow test results

Flow is a web browser with a proprietary browser engine that claims to “dramatically improve rendering performance” and is being developed by the Ekioh company. The browser has no documentation, meaning it is quite hard to figure out what it supports and what it does not support. These were some of my findings when testing my survey site:

- `border-radius` on `span` elements that do not have `display` property set **does not** work
- There is **no** pointer cursor
- No CSS animation triggered with `prefers-reduced-motion` query
- Javascript modules may not be supported
- `<progress>` element not supported
- Values of input fields on inital load are either transparent or the same color as the background
- `::placeholder` property not supported
- No native HTML form validate (would be dealt by server)

### :mag_right: UC Mobile test results

- Javascript modules maybe not *really* supported even though [caniuse.com](https://caniuse.com) states it does support it

### :mag_right: Chrome (android)

- For some reason localstorage works, but it cannot set the saved values (for exmaple: course revision does not set previous selected/saved data)

