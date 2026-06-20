import { useEffect, useRef, useState } from "react";
import { FaPlusCircle, FaCloudUploadAlt, FaWrench, FaDollarSign, FaFileAlt } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import Label from "../../components/label/Label";
import { useSelector } from "react-redux";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./ServiceCreate.scss";

const ServiceCreate = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ImgDefault = "https://static-00.iconduck.com/assets.00/wrench-icon-2047x2048-jyerjpd9.png";
  const maxCharacters = 200;

  const t = {
    title: { en: "Create New Service", kh: "បន្ថែមសេវាកម្មថ្មី", zh: "添加新服务" },
    subtitle: { 
      en: "Fill in the details to publish a new service to the marketplace.", 
      kh: "បំពេញព័ត៌មានលម្អិតដើម្បីផ្សព្វផ្សាយសេវាកម្មថ្មីរបស់អ្នកទៅកាន់គេហទំព័រផ្សារ។", 
      zh: "填写详细信息以在市场中发布新服务。" 
    },
    nameLabel: { en: "Service Title", kh: "ចំណងជើងសេវាកម្ម", zh: "服务标题" },
    descLabel: { en: "Description", kh: "ការពិពណ៌នា", zh: "服务描述" },
    priceLabel: { en: "Price ($)", kh: "តម្លៃ ($)", zh: "价格 ($)" },
    uploadTitle: { en: "Service Cover Image", kh: "រូបភាពគម្របសេវាកម្ម", zh: "服务封面图片" },
    uploadPrompt: { 
      en: "Drag & drop image here, or click to browse", 
      kh: "អូស & ទម្លាក់រូបភាពនៅទីនេះ ឬ ចុចដើម្បីស្វែងរក", 
      zh: "拖拽图片至此，或点击浏览" 
    },
    uploadLimit: { en: "Supports JPG, PNG (Max 2MB)", kh: "គាំទ្រ JPG, PNG (ទំហំធំបំផុត 2MB)", zh: "支持 JPG、PNG（最大 2MB）" },
    uploading: { en: "Uploading image...", kh: "កំពុងបញ្ចូលរូបភាព...", zh: "正在上传图片..." },
    uploadSuccess: { en: "Image uploaded successfully!", kh: "បញ្ចូលរូបភាពបានជោគជ័យ!", zh: "图片上传成功！" },
    uploadError: { en: "Upload failed (Max 2MB)", kh: "ការបញ្ចូលរូបភាពបរាជ័យ (ទំហំធំបំផុត 2MB)", zh: "上传失败（最大 2MB）" },
    submitBtn: { en: "Publish Service", kh: "ផ្សព្វផ្សាយសេវាកម្ម", zh: "发布服务" },
    loadingBtn: { en: "Publishing...", kh: "កំពុងផ្សព្វផ្សាយ...", zh: "正在发布..." },
  };

  const getLabel = (key) => t[key]?.[language] || t[key]?.["en"];

  useEffect(() => {
    if (file) {
      StoreImage(file);
    }
  }, [file]);

  const StoreImage = (file) => {
    setFileUploadError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prev) => ({ ...prev, image: downloadURL }))
        );
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && value.length > 50) return;
    if (name === "description" && value.length > maxCharacters) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        image: formData.image || ImgDefault,
        userRef: currentUser._id,
      };

      const res = await fetch("/api/service/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });
      
      const data = await res.json();
      setLoading(false);
      
      if (data.success === false) {
        setError(data.message);
        return;
      }
      
      // Route back to services list
      navigate("/profile");
      window.location.reload();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={`service-create-container ${theme}`}>
      {/* Header */}
      <header className="service-create-header">
        <h1 className="header-title">{getLabel("title")}</h1>
        <p className="header-subtitle">{getLabel("subtitle")}</p>
      </header>

      {/* Form */}
      <form className="service-create-form" onSubmit={handleSubmit}>
        {/* Form Inputs (Left) */}
        <div className="form-column-inputs">
          <div className="input-group">
            <span className="input-icon"><FaWrench /></span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={getLabel("nameLabel")}
              required
            />
          </div>

          <div className="input-group textarea-group">
            <span className="input-icon"><FaFileAlt /></span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={getLabel("descLabel")}
              required
              maxLength={maxCharacters}
            />
            <span className="textarea-counter">
              {formData.description.length}/{maxCharacters}
            </span>
          </div>

          <div className="input-group">
            <span className="input-icon"><FaDollarSign /></span>
            <input
              type="number"
              name="price"
              step="0.001"
              value={formData.price}
              onChange={handleChange}
              placeholder={getLabel("priceLabel")}
              required
            />
          </div>

          {error && <div className="error-message-box">{error}</div>}

          <button type="submit" className="submit-service-btn" disabled={loading}>
            <FaPlusCircle />
            <span>{loading ? getLabel("loadingBtn") : getLabel("submitBtn")}</span>
          </button>
        </div>

        {/* Form Uploader (Right) */}
        <div className="form-column-uploader">
          <Label label={getLabel("uploadTitle")} />
          
          <div 
            className={`image-dropzone-box ${formData.image ? "has-image" : ""}`}
            onClick={() => fileRef.current.click()}
          >
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              ref={fileRef}
              hidden
              accept="image/*"
            />
            
            {formData.image ? (
              <div className="dropzone-preview">
                <img src={formData.image} alt="Service cover" />
                <div className="dropzone-overlay">
                  <FaCloudUploadAlt className="overlay-icon" />
                  <span>{getLabel("changeImage") || "Click to Change"}</span>
                </div>
              </div>
            ) : (
              <div className="dropzone-placeholder">
                <FaCloudUploadAlt className="placeholder-icon" />
                <span className="placeholder-prompt">{getLabel("uploadPrompt")}</span>
                <span className="placeholder-limit">{getLabel("uploadLimit")}</span>
              </div>
            )}
          </div>

          {/* Status alerts */}
          <div className="upload-status-wrapper">
            {filePerc > 0 && filePerc < 100 && (
              <div className="status-indicator loading">
                <span className="progress-bar" style={{ width: `${filePerc}%` }}></span>
                <span className="status-text">{getLabel("uploading")} {filePerc}%</span>
              </div>
            )}
            {filePerc === 100 && !fileUploadError && (
              <div className="status-indicator success">
                <span className="status-text">{getLabel("uploadSuccess")}</span>
              </div>
            )}
            {fileUploadError && (
              <div className="status-indicator error">
                <span className="status-text">{getLabel("uploadError")}</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceCreate;
