'use client';
import { Form, Input, Rate } from 'antd';
import Btn from '../UI/Btn';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';

function CreateReview() {
  const [form] = useForm();

  return (
    <Form
      id='Reviews-Create-A-Comment'
      layout='vertical'
      form={form}
      initialValues={{
        overalAllRating: 0
      }}
      onFinish={(values) => {
        console.log(values);
        const getFormValues = async () => {
          const data = await form.getFieldsValue();
          console.log(data);
        };
        getFormValues();
        const res = form.getFieldsValue();
        console.log(res);
      }}
      style={{ scrollMarginTop: 130 }}
    >
      <Form.Item
        label='overall Rating'
        name='overAllRating'
        style={{ marginBottom: 16 }}
        rules={[
          { required: true, message: 'Overall rating is required' }
        ]}
      >
        <Rate allowHalf />
      </Form.Item>
      <Form.Item
        label='Add a headline'
        name='headline'
        style={{ marginBottom: 16 }}
        rules={[{ required: true, message: 'Headline is required' }]}
      >
        <Input
          placeholder="what's the most important to know?"
          style={{ paddingInline: 16, paddingBlock: 12 }}
        />
      </Form.Item>
      <Form.Item
        label='Add a written review'
        name='comment'
        style={{ marginBottom: 16 }}
        rules={[{ required: true, message: 'Comment is required' }]}
      >
        <TextArea
          rows={4}
          placeholder='What did you like or dislike? What did you use this product for?'
          style={{ paddingInline: 16, paddingBlock: 12 }}
        />
      </Form.Item>
      <Btn
        className='ml-auto mt-5 w-fit rounded-md bg-green-dark px-8 text-white'
        type='submit'
      >
        Submit Review
      </Btn>
    </Form>
  );
}

export default CreateReview;
