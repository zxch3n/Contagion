import styled from 'styled-components';

export const ChartContainer = styled.div`
    width: 100%;
    max-width: 600px;
    margin: 0 36px;
    position: relative;
    border-radius: 8px;


    h3 {
        text-align: center;
        position: relative;
        left: 60px;
        color: #ccc;
        cursor: default;
        margin: 0;
    }

    .slick-prev:before, .slick-next:before {
        color: #aaa;
    }

    .slick-prev {
        left: 4px;
        z-index: 2;
    }

    .slick-next {
        z-index: 2;
        right: -12px;
    }

    .slick-dots {
        bottom: 0px;
        right: -40px;
    }

    .slick-dots li button:before {
        color: white;
    }
`;