import React from 'react';
import { Card, Typography, Divider } from 'antd';

const { Title, Paragraph } = Typography;

const CommunitySupport: React.FC = () => {
    return (
        <Card style={{ maxWidth: 800, margin: '40px auto', borderRadius: 12 }}>
            <Title level={2}>Community Support</Title>
            <Paragraph>Welcome to the Community Support section! Here, artisans and customers can connect, share experiences, and seek assistance.</Paragraph>
            <Divider />
            <div className="support-forum" style={{ marginBottom: 24 }}>
                <Title level={4}>Forums</Title>
                <Paragraph>Join discussions about products, techniques, and more.</Paragraph>
                {/* Forum component can be added here */}
            </div>
            <Divider />
            <div className="q-and-a">
                <Title level={4}>Q&amp;A Section</Title>
                <Paragraph>Have questions? Ask the community or provide answers to others.</Paragraph>
                {/* Q&A component can be added here */}
            </div>
        </Card>
    );
};

export default CommunitySupport;