# GLS

	GLS (guided learning solution) is a minified step by step guide. 
	The project constitutes a GLS frontend engine in the form of a sequence of steps for the google.com page.



## Setup Instructions

	* Download the ZIP file of the given repository code
	* Locate the ZIP file on your computer and unzip it
	* Open Google Chrome browser
	* Browse to chrome://extensions/ page
	* Check the toggle for Developer mode in the top right
	* Load unpacked extension button
	* Select "Frontend_engine" folder under the "GLS-master" folder from the ZIP file
	* Browse to https://www.google.com/ page
	* Go through the steps of the guide



## Tests Setup

	Sanity STD.docx is attached 
	
	

## Assumptions

	* Considering the discrepancy between HTML to CSS hierarchy- creation of 3 HTML elements manually.
	  It might be done by an automatic algorithm also (might be an expensive run-time factor because of the CSS scope which also includes irrelevant elements for the exercise).
	* Considering the second step data- setting a condition that does not allow the user continue the guide
	  or getting the "Images" section until clicking the given selector. 
	  (Note that the selector of one of the next follower steps does not exist on the "Images" section page, 
	  Therefore, for the rest of the guide, it is not possible to get the "Images" section page).
	* Considering the "watchDog" attribute- detecting the user's activity and note the DevTools Console when the user is idle
	  during the usage of the guide, according to the given watchDog timer. 
	  (This attribute might be used for end users behaviour insights and to indicate the relevance of the guide).
	* The method of retrieving the JSON has been changed on Sunday 06/09/20 due to CORS policy block (fetch method has been replaced with 'data.json' file).

 
