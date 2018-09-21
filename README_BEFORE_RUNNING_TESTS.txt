
My server-side unit tests need two dummy local Meteor accounts to work:
Username: "a@blah.com", Password: "a"
Username: "b@blah.com", Password: "b"

My unit tests will try to create and edit a post using the first account.
They will also try to create and edit a comment using the second account
and attach that new comment to the newly created sample post.

My unit tests will also try to delete the newly created sample post 
and ensure that the accompanying comment gets deleted automatically.

