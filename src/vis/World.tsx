import React from "react";
import styled from "styled-components";


const Container = styled.div`
    min-width: 700px;
    min-height: 600px;
    background-color: rgba(100, 100, 100, 0.5);
`;

export class World extends React.Component{
    render() {
        return <Container></Container>;
    }
}
