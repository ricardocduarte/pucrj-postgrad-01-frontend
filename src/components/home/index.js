import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabela from "../Hotels/listAll";
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';


const Index =()=>{

    return(
        <div style={{padding:20}}>
            <Card>
                <Card.Body>
                <Card.Title>Cadastro de hotéis</Card.Title>
                    <Tabela/>                  
                </Card.Body>            
            </Card> 
        </div>
                    
               
    )
}
export default Index