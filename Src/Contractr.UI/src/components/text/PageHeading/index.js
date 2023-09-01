import React from "react";
import Column from "../../layout/Column";
import Row from "../../layout/Row";

const PageHeading = (props) => {
    return (
        <Row>
            <Column size="lg-12">
                <h5 className="c-grey-600 d-i">{props.text}</h5>
                {props.children}
            </Column>
        </Row>
    )
}

export default PageHeading;