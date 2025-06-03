import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const NotFound: React.FC = () => {
    const history = useHistory();
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you are looking for does not exist."
            extra={<Button type="primary" onClick={() => history.push('/')}>Back Home</Button>}
            style={{ marginTop: 50 }}
        />
    );
};

export default NotFound;