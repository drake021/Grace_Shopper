import React, {useState, useHook} from 'react';

const ApiDocuments = () => {

    return <>
        <div id="ApiDocuments">
            <h1>Api Documentation</h1>
            <h2>Introduction</h2>
            <h3>Authentication through JSON Web Tokens</h3>
            <h3>General Return Schema</h3>

            <h2>User Endpoints</h2>
            <h3>
                <code>
                    POST api/users/register
                </code>
            </h3>
            <p>
                This route is used to create a new user account. On success, you will be given a JSON Web Token to be passed to the server for requests requiring authentication.
            </p>
            <h3>
                Request Parameters
            </h3>
            <h3>
                Return Parameters
            </h3>
            <h3>
                Sample Call
            </h3>
            <h3>
                Sample Response
            </h3>
        </div>
    </>
};

export default ApiDocuments;