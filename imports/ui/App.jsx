import PropTypes from 'prop-types';
import React from 'react';

const App = (props) => {
    return(
        <div className="app-container" id="app-container">
            {props.children}
        </div>
    )
};

export default App;

App.propTypes = {
    children: PropTypes.any
}
