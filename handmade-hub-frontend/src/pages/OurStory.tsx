import React from 'react';
import { Card, Typography, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const OurStory: React.FC = () => {
    return (
        <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 24px' }}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <Row gutter={[32, 32]} align="middle" wrap>
                    {/* Left: Image */}
                    <Col xs={24} md={10} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf7f2', borderRadius: 12 }}>
                        <img
                            src="/images/image_4.jpg"
                            alt="Our Story"
                            style={{ width: '100%', maxWidth: 420, height: 'auto', objectFit: 'cover', borderRadius: 8, margin: 32 }}
                        />
                    </Col>
                    {/* Right: Text */}
                    <Col xs={24} md={14} style={{ padding: '48px 40px', textAlign: 'center' }}>
                        <Title level={1} style={{ fontWeight: 700, fontSize: '2.3rem', marginBottom: 28, letterSpacing: '-1px' }}>THIS IS US</Title>
                        <Paragraph style={{ fontSize: '1.13rem', color: '#222', marginBottom: 28, lineHeight: 1.7 }}>
                            This is a space to share more about the business. Take advantage of this long text to tell people who's behind it, what it does, how it began, and other details. It's an excellent place to share the story behind the business and describe what this site has to offer its visitors.
                        </Paragraph>
                        <Paragraph style={{ fontSize: '1.13rem', color: '#222', marginBottom: 28, lineHeight: 1.7 }}>
                            You can write about the business's history here, from its founding until now. Draw readers in with an engaging narrative. By telling its story, you can help people connect to the business. Share what inspired its creation and what need it was meant to fill. You can include details of the obstacles it overcame to get where it is today.
                        </Paragraph>
                        <Paragraph style={{ fontSize: '1.13rem', color: '#222', marginBottom: 0, lineHeight: 1.7 }}>
                            This space is also a good spot to talk about a particular feature of the business that sets it apart from its competitors. Explain to readers what makes this business unique and why they should choose it over other options. Focus on the value this business can offer its users.
                        </Paragraph>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default OurStory;
