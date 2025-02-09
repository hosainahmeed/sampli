import React, { useState } from "react";
import { Button, Typography, message, Upload, Form, Input, Image } from "antd";
import "antd/dist/reset.css";
import Logo from "../../components/ui/Logo";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import InputField from "./InputField";

const { Title } = Typography;

const FileUpload = ({ fileList, onChange, beforeUpload, accept }) => (
  <Upload
    fileList={fileList}
    beforeUpload={beforeUpload}
    onChange={onChange}
    accept={accept}
    showUploadList={false}
  >
    <Button icon={<UploadOutlined />} className="bg-[#21B6F2] text-white">
      Upload Image
    </Button>
  </Upload>
);

const ComplianceInfo = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      if (fileList.length > 0) {
        formData.append("file", fileList[0]);
      }
      console.log("EIN:", values.ein);
      console.log("Uploaded File:", fileList[0]);
      message.success("Form submitted successfully!");
    } catch (error) {
      message.error("Please fill out all fields correctly.");
    }
  };

  const handleUpload = ({ file }) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return;
    }
    setFileList([file]);
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setFileList([]);
    setPreviewImage(null);
    form.resetFields();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg ">
        <Title level={3} className="text-blue-500">
          <Logo />
        </Title>
        <div className="flex mb-6 flex-col items-start">
          <Title level={2} className="text-start mb-1">
            Primary Contact and Compliance Information
          </Title>
          <h1 className="text-start text-[var(--body-text)]">
            Share your primary contact details along with any relevant
            compliance information.
          </h1>
        </div>
        <Form requiredMark={false} form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="space-y-6">
            <InputField
              className="text-start"
              label="EIN"
              name="ein"
              rules={[{ required: true, message: "Please enter your EIN!" }]}
              placeholder="123456789"
              type="number"
            />
            {/* Upload Section */}
            <Form.Item label="Certifcate of Incorporation *" name="">
              <FileUpload
                fileList={fileList}
                beforeUpload={(file) => {
                  handleUpload({ file });
                  return false;
                }}
                accept="image/*"
              />
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Preview"
                  className="mt-4 max-w-xs"
                />
              )}
            </Form.Item>

            {/* Buttons */}
            <Button className="w-full" type="primary" htmlType="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ComplianceInfo;

