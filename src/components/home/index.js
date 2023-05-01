import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabela from "../Hotels/listAll";


const Index =()=>{

    return(
        <Container >
            <Row>
                <Col xs={8}>
                    <Tabela/>  
                </Col>
                              
            </Row>
        </Container>
    )
}
export default Index