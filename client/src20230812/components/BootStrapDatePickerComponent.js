import React from 'react'
import { Form } from 'react-bootstrap';

class BootstrapDatePickerComponent extends React.Component {

    render() {

        return (
            <div>
                <div className="row">
                    <div className="col-md-2">
                        <Form.Group controlId="dt">
                            <Form.Label>Select Date</Form.Label>
                            <Form.Control type="date" name="dt" placeholder="Date" />
                        </Form.Group>
                    </div>
                </div>
            </div>
        )
    }

}

export default BootstrapDatePickerComponent;