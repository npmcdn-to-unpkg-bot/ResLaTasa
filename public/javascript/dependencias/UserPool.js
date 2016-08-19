function UserPool(email, password) {
    this.email = email;
    this.password = password;
}

UserPool.prototype.signin = function (callback) {
    
    //Cognito Identity pool ID
    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:b6a48c94-49bf-4c92-b2be-f4e8a40c4313'
    });

    //Cognito User pool ID
    AWSCognito.config.region = 'us-east-1';
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:b6a48c94-49bf-4c92-b2be-f4e8a40c4313'
    });


    var poolData = {
        UserPoolId: 'us-east-1_PGEQSlhxc',
        ClientId: '7h1ro401od9gvdlkqbjhdtuj6b'
    };

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    userPool.setParanoia(7);

    var userData = {
        Username: this.email,
        Pool: userPool
    };
    var authenticationData = {
        Username: this.email,
        Password: this.password
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result){
	    callback(result);
        },
        onFailure: function (err) {
            alert(err);
        },
        mfaRequired: function (codeDeliveryDetails) {
            var verificationCode = prompt('Please input verification code', '');
            cognitoUser.sendMFACode(verificationCode, this);
        }
    });
}
