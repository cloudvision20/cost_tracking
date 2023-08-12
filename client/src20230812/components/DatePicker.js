// import React from 'react'
import { Form } from 'react-bootstrap';

// class DatePicker extends React.Component {

const DatePicker = ({ selectedValue, placeholder, id }) => {

    return (
        <div>
            <div className="row">
                <div className="col-md-2">
                    <Form.Group controlId={id}>
                        <Form.Label>Select Date</Form.Label>
                        <Form.Control
                            type="date"
                            name={id}
                            defaultValue={selectedValue}
                            placeholder={placeholder}
                            onChange={(e) => this.props.onChange(e)} />
                    </Form.Group>
                </div>
            </div>
        </div>
    )
}


export default DatePicker;