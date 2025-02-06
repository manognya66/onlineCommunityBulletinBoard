import * as React from 'react';
import Button from '@mui/material/Button';

function DynamicButton({ 
    label, 
    onClick, 
    disabled = false, 
    style = {}, 
    className = "",
}) {
    return (
        <React.Fragment>
            <Button
                variant="contained"
                disabled={disabled}
                onClick={onClick}
                style={{
                    height: "40px",
                    width: "200px",
                    fontSize: "16px",
                    fontFamily: '"Open Sans", sans-serif',
                    ...style,
                }}
                className={className}
                type="submit"
            >
                {label}
            </Button>
        </React.Fragment>
    );
}

export default DynamicButton;