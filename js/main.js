/**
 * Main object
 */
var UserManagemntSystem = {

	/**
	 * function for methods initialization
	 */
    init: function() {
    	// variables declaration
        var xmlhttp,
        	usersData;

        // load data from external json file via ajax
        this.loadData();
    },

    /**
	 * loads data from external file an calls methods that manipulate these data
	 */
    loadData: function() {
		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			UserManagemntSystem.xmlhttp = new XMLHttpRequest();
		} else {
			// code for IE6, IE5
			UserManagemntSystem.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		}

		UserManagemntSystem.xmlhttp.onreadystatechange = function() {
			var addButton = document.querySelectorAll('.add-button'), 
				removeButton = document.querySelectorAll('.remove-button'),
				addToGroupButton = document.querySelectorAll('.add-to-group'),
				removeFromGroupButton = document.querySelectorAll('.remove-from-group');

			if (UserManagemntSystem.xmlhttp.readyState === 4 && UserManagemntSystem.xmlhttp.status === 200) {
				UserManagemntSystem.usersData = JSON.parse(UserManagemntSystem.xmlhttp.responseText);

				// show initial users and groups lists
				UserManagemntSystem.updateUsersList();
				UserManagemntSystem.updateGroupsList();

				// add a user or a group and update the lists
				for (var i = 0; i < addButton.length; i++) {
				    addButton[i].addEventListener('click', function(event) {
				        UserManagemntSystem.addElement();
						UserManagemntSystem.updateUsersList();
						UserManagemntSystem.updateGroupsList();
				    });
				}

				// remove a user or a group and update the lists
				for (var i = 0; i < removeButton.length; i++) {
				    removeButton[i].addEventListener('click', function(event) {
				        UserManagemntSystem.removeElement();
						UserManagemntSystem.updateUsersList();
						UserManagemntSystem.updateGroupsList();
				    });
				}

				// assign a user to a group and update the lists
				for (var i = 0; i < addToGroupButton.length; i++) {
				    addToGroupButton[i].addEventListener('click', function(event) {
				        UserManagemntSystem.addUserToGroup();
						UserManagemntSystem.updateUsersList();
						UserManagemntSystem.updateGroupsList();
				    });
				}
				
				// remove a user from a group and update the lists
				for (var i = 0; i < removeFromGroupButton.length; i++) {
				    removeFromGroupButton[i].addEventListener('click', function(event) {
				        UserManagemntSystem.removeUserFromGroup();
						UserManagemntSystem.updateUsersList();
						UserManagemntSystem.updateGroupsList();
				    });
				}
		    }
		}

		UserManagemntSystem.xmlhttp.open('GET', 'data.json', true);

		UserManagemntSystem.xmlhttp.send();
    },

    /**
     * get and return text input value
     */
    getInputValue: function() {
    	var eventTarget = event.target,
    		targetParent = eventTarget.parentNode,
    		elementNameValue = null;

    	for (var i = 0; i < targetParent.childNodes.length; i++) {
		    if (targetParent.childNodes[i].className === 'value') {
		    	elementNameValue = targetParent.childNodes[i].value;
				break;
		    }        
		}

		return elementNameValue;
    },
    
    /**
     * add a new user or a group to a corresponding json object
     */
   	addElement: function() {
    	var eventTarget = event.target,
    		existingElement = [],			
			buttonClass = eventTarget.className.split(' ')[0], // get the first class
			elementNameValue = UserManagemntSystem.getInputValue(), // get input value
			newUser = null,
			newGroup = null;

		// new user object
		newUser = {
	        "elementName": elementNameValue,
	        "groups": []
	    };

	    // new group object
	    newGroup = {
	        "elementName": elementNameValue,
			"users": []
	    };

	    // check if any value was entered
		if (elementNameValue) {
			// iterate through users data keys: users and groups
			for (var key in UserManagemntSystem.usersData) {
				// iterate through objects in users and groups
				for (var subKey in UserManagemntSystem.usersData[key]) {
					// add a string to an existingElement array if the user or a group with this name is already in the list
			    	if (UserManagemntSystem.usersData[key][subKey].elementName === elementNameValue && 
			    		existingElement.length === 0) {
			    		existingElement.push('Existing element');
					}
				}
			}

			if (existingElement.length === 0) {
				// add a user if existingElement array is empty
				if (buttonClass === 'user') {
					UserManagemntSystem.usersData.users.push(newUser);
				} 

				// add a group if existingElement array is empty
				if (buttonClass === 'group') {
					UserManagemntSystem.usersData.groups.push(newGroup);
				} 
			// popup an alert that a user or a group with this name already exist 
			} else if (existingElement.length !== 0 && buttonClass === 'user') {
				alert('This user already exists!');
			} else {
				alert('This group already exists!');
			}
		}     
    },

    /**
     * Create or update a users list after a new user was added
     */
    updateUsersList: function() {
    	var usersWrapper = document.getElementById('users-list'),
    		userName, 
    		userGroups,
			newNode;

		usersWrapper.innerHTML = '';

		// iterate through all users
    	for (var key in UserManagemntSystem.usersData.users) {
    		// create new html nodes
 			newNode = document.createElement('div');
 			userName = document.createElement('p');
 			userGroups = document.createElement('p');

 			// populate html nodes with content
			userName.innerHTML = '<span>User name:</span> ' + UserManagemntSystem.usersData.users[key].elementName;
			userGroups.innerHTML = '<span>Groups:</span> ' + UserManagemntSystem.usersData.users[key].groups.join([separator = ', ']);

			// append the nodes to the DOM
			newNode.appendChild(userName);
			newNode.appendChild(userGroups);
			usersWrapper.appendChild(newNode);
		}
    },

    /**
     * Create or update a groups list after a new group was added
     */
    updateGroupsList: function() {
    	var groupsWrapper = document.getElementById('groups-list'),
    		groupName,
    		groupUsers,
			newNode;

		// reset the content before updating in with new elements
		groupsWrapper.innerHTML = ''; 

		// iterate through all groups
    	for (var key in UserManagemntSystem.usersData.groups) {
    		// create new html nodes
			newNode = document.createElement('div');
 			groupName = document.createElement('p');
 			groupUsers = document.createElement('p');

 			// populate html nodes with content
			groupName.innerHTML = '<span>Group name:</span> ' + UserManagemntSystem.usersData.groups[key].elementName;
			groupUsers.innerHTML = '<span>Users:</span> ' + UserManagemntSystem.usersData.groups[key].users.join([separator = ', ']);

			// append the nodes to the DOM
			newNode.appendChild(groupName);
			newNode.appendChild(groupUsers);
			groupsWrapper.appendChild(newNode);
		}
    },

    /**
     * remove user or group
     */
    removeElement: function() {
    	var eventTarget = event.target,	
    		buttonClass = eventTarget.className.split(' ')[0], // get the first class
    		removeElementNameValue = UserManagemntSystem.getInputValue(); // get input value

    	// check if any content was entered in an input field
		if (removeElementNameValue) {
			// iterate through users data keys: users and groups
			for (var key in UserManagemntSystem.usersData) {
				// iterate through objects in users and groups
				for (var subKey in UserManagemntSystem.usersData[key]) {
					// check if a user or a group with the entered name already exists
					if (UserManagemntSystem.usersData[key][subKey].elementName === removeElementNameValue) {
						if (buttonClass === 'user') {
							// remove a user
							UserManagemntSystem.usersData.users.splice(subKey, 1);
						} else {
							// remove a group
							UserManagemntSystem.usersData.groups.splice(subKey, 1);
						}
					}
				}
			}

			// iterate through users 
			for (var uKey in UserManagemntSystem.usersData.users) {
				// check if a user belongs to an entered group
				if (UserManagemntSystem.usersData.users[uKey].groups == removeElementNameValue) {
					// iterate through an array of groups a user belongs to
					for (var gaKey in UserManagemntSystem.usersData.users[uKey].groups) {
						// if a group was deleted (see the code above), 
						// remove the group from the list of groups a user belongs to
						UserManagemntSystem.usersData.users[uKey].groups.splice(gaKey, 1);
					}
				}
			}

			// iterate through groups
			for (var gKey in UserManagemntSystem.usersData.groups) {
				// check if any users belong to the entered group
				if (UserManagemntSystem.usersData.groups[gKey].users == removeElementNameValue) {
					// iterate through an array of users that belong to a group
					for (var uaKey in UserManagemntSystem.usersData.groups[gKey].users) {
						// if a user was deleted (see the code above), 
						// remove the user from the list of users that belong to this group
						UserManagemntSystem.usersData.groups[gKey].users.splice(uaKey, 1);
					}
				}
			} 
		}   
    },    

    /**
     * add a user to a group
     */
    addUserToGroup: function() {
    	var eventTarget = event.target,	
    		userNameValue = UserManagemntSystem.getInputValue(), // get input value
    		targetGroupNameValue = document.querySelector('.add-groupsusers .group-name').value; 

    	// check if both values were entered
		if (userNameValue && targetGroupNameValue) {
			// iterate through all users
			for (var key in UserManagemntSystem.usersData.users) {
				// iterate through all groups
				for (var subKey in UserManagemntSystem.usersData.groups) {
					// check if a user with an entered name exists
					if (UserManagemntSystem.usersData.users[key].elementName === userNameValue && 
						// check if a group with an entered name exists
						UserManagemntSystem.usersData.groups[subKey].elementName === targetGroupNameValue && 
						// check if the user belong to the group already
						UserManagemntSystem.usersData.groups[subKey].users != userNameValue) {

						// update users and groups json
						UserManagemntSystem.usersData.users[key].groups.push(targetGroupNameValue);
						UserManagemntSystem.usersData.groups[subKey].users.push(userNameValue);
					}
				}		
			}
		} else {
			// popup an alert if one or both values were not entered
			alert('Please, enter both values');
		}
    },

    /**
     * remove a user from a group
     */
    removeUserFromGroup: function() {
    	var eventTarget = event.target,	
    		userNameValue = UserManagemntSystem.getInputValue(), // get an input value
    		targetGroupNameValue = document.querySelector('.remove-groupsusers .group-name').value;

    	// check if both values were entered
		if (userNameValue && targetGroupNameValue) {
			// iterate thgrough all users
			for (var key in UserManagemntSystem.usersData.users) {
				// iterate thgrough all groups
				for (var subKey in UserManagemntSystem.usersData.groups) {
					// check if both the user and the group exist
					if (UserManagemntSystem.usersData.users[key].elementName === userNameValue && 
						UserManagemntSystem.usersData.groups[subKey].elementName === targetGroupNameValue) {
						// iterate through groups the user belong to
						for (var gaKey in UserManagemntSystem.usersData.users[key].groups) {
							// find the entered group in the array of groups the user belongs to
							if (UserManagemntSystem.usersData.users[key].groups[gaKey] === targetGroupNameValue) {
								// remove the group from the array
								UserManagemntSystem.usersData.users[key].groups.splice(gaKey, 1);
							}
						}
						// itreate through all users that belong to the group
						for (var uaKey in UserManagemntSystem.usersData.groups[subKey].users) {
							// find the entered name in the array of users that belong to this group
							if (UserManagemntSystem.usersData.groups[subKey].users[uaKey] === userNameValue) {
								// remove the user from the array
								UserManagemntSystem.usersData.groups[subKey].users.splice(uaKey, 1);
							}
						}
					}
				}		
			}
		} else {
			// popup an alert if one or both values were not entered
			alert('Please, enter both values');
		}

    }   
};

(function(){
    // initialise the user management system when the DOM is ready
    UserManagemntSystem.init();
})();  
