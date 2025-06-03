import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { addToCart } from '../utils/helpers';
import {
  Layout,
  Card,
  Typography,
  InputNumber,
  Button,
  Radio,
  DatePicker,
  Input,
  Alert,
  Row,
  Col,
  message
} from 'antd';
import { GiftOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text } = Typography;

const amounts = [25, 50, 100, 150, 200];

const GiftCard: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [quantity, setQuantity] = useState(1);
  const [recipientType, setRecipientType] = useState<'someone' | 'myself'>('someone');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [feedback, setFeedback] = useState('');
  const history = useHistory();

  const giftCardItem = {
    type: 'giftcard',
    amount: selectedAmount,
    quantity,
    recipientType,
    recipientEmail,
    recipientName,
    deliveryDate,
    message: messageText,
    id: `giftcard-${selectedAmount}-${recipientEmail}-${Date.now()}`,
    price: selectedAmount,
    name: 'eGift Card',
    image: '/images/image_8.jpg',
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    addToCart(giftCardItem);
    setFeedback('Gift card added to cart!');
    message.success('Gift card added to cart!');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleBuyNow = (e: React.FormEvent) => {
    e.preventDefault();
    addToCart(giftCardItem);
    history.push('/checkout');
  };

  return (
    <Layout style={{ background: '#fff', minHeight: '100vh' }}>
      <Content style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <Row gutter={[48, 32]} align="top">
            <Col xs={24} md={10}>
              <img src="/images/image_8.jpg" alt="Gift Card" style={{ width: '100%', maxWidth: 340, height: 220, objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} onError={e => (e.currentTarget.src = '/images/image_1.jpg')} />
            </Col>
            <Col xs={24} md={14}>
              <Title level={2}><GiftOutlined /> eGift Card</Title>
              <Text type="secondary">Send the perfect gift instantly or schedule for later!</Text>
              <form onSubmit={handleAddToCart} style={{ marginTop: 24 }}>
                <div style={{ marginBottom: 18 }}>
                  <Text strong>Amount: </Text>
                  <Radio.Group value={selectedAmount} onChange={e => setSelectedAmount(e.target.value)} style={{ marginLeft: 12 }}>
                    {amounts.map(amount => (
                      <Radio.Button key={amount} value={amount}>${amount}</Radio.Button>
                    ))}
                  </Radio.Group>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <Text strong>Quantity: </Text>
                  <InputNumber min={1} max={10} value={quantity} onChange={v => setQuantity(Number(v) || 1)} style={{ width: 80, marginLeft: 12 }} />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <Text strong>Recipient: </Text>
                  <Radio.Group value={recipientType} onChange={e => setRecipientType(e.target.value)} style={{ marginLeft: 12 }}>
                    <Radio value="someone">Someone else</Radio>
                    <Radio value="myself">Myself</Radio>
                  </Radio.Group>
                </div>
                {recipientType === 'someone' && (
                  <>
                    <div style={{ marginBottom: 18 }}>
                      <Input placeholder="Recipient's Name" value={recipientName} onChange={e => setRecipientName(e.target.value)} style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <Input placeholder="Recipient's Email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} style={{ width: '100%' }} />
                    </div>
                  </>
                )}
                <div style={{ marginBottom: 18 }}>
                  <Text strong>Delivery Date: </Text>
                  <DatePicker
                    value={deliveryDate ? dayjs(deliveryDate) : undefined}
                    onChange={date => setDeliveryDate(date ? date.format('YYYY-MM-DD') : null)}
                    style={{ marginLeft: 12 }}
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <Input.TextArea rows={3} placeholder="Add a message (optional)" value={messageText} onChange={e => setMessageText(e.target.value)} />
                </div>
                {feedback && <Alert message={feedback} type="success" showIcon style={{ marginBottom: 12 }} />}
                <Row gutter={12}>
                  <Col span={12}>
                    <Button type="primary" icon={<ShoppingCartOutlined />} htmlType="submit" block>Add to Cart</Button>
                  </Col>
                  <Col span={12}>
                    <Button icon={<DollarOutlined />} block onClick={handleBuyNow}>Buy Now</Button>
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default GiftCard;
