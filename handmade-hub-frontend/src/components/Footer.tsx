import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Divider } from 'antd';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => (
  <AntFooter style={{ background: '#fafafa', borderTop: '1px solid #eee', padding: '48px 0 32px 0', marginTop: 60 }}>
    <div style={{ maxWidth: 1300, margin: '0 auto' }}>
      <Row gutter={[48, 32]} justify="space-between">
        <Col xs={24} sm={8} md={6}>
          <Title level={4} style={{ marginBottom: 18, color: '#333', letterSpacing: '-1px' }}>SHOP</Title>
          <Link to="/our-story" style={{ color: '#222', textDecoration: 'underline', fontWeight: 500, display: 'block', marginBottom: 8, fontSize: '1.05rem' }}>Our Story</Link>
          <Link to="/gift-card" style={{ color: '#222', textDecoration: 'underline', fontWeight: 500, display: 'block', marginBottom: 8, fontSize: '1.05rem' }}>Gift Card</Link>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Title level={4} style={{ marginBottom: 18, color: '#333', letterSpacing: '-1px' }}>HELPFUL LINKS</Title>
          {/* Add more helpful links here if needed */}
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Title level={4} style={{ marginBottom: 18, color: '#333', letterSpacing: '-1px' }}>CONTACT US</Title>
          <Text style={{ color: '#444', fontSize: '1.05rem', display: 'block', marginBottom: 6 }}>500 Terry Francine St.</Text>
          <Text style={{ color: '#444', fontSize: '1.05rem', display: 'block', marginBottom: 6 }}>San Francisco, CA 94158</Text>
          <Text style={{ color: '#444', fontSize: '1.05rem', display: 'block', marginBottom: 6 }}>123-456-7890</Text>
          <Text style={{ color: '#444', fontSize: '1.05rem', display: 'block', marginBottom: 6 }}>info@mysite.com</Text>
        </Col>
      </Row>
      <Divider style={{ margin: '40px 0 0 0' }} />
      <div style={{ textAlign: 'center', color: '#aaa', fontSize: '1rem', marginTop: 24 }}>
        &copy; {new Date().getFullYear()} Handmade Hub. All rights reserved.
      </div>
    </div>
  </AntFooter>
);

export default Footer;
