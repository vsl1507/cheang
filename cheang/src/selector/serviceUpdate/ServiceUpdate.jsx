import { useEffect, useRef, useState } from "react";
import { FaSave, FaWrench, FaDollarSign, FaFileAlt, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
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
import { useToast } from "../../context/ToastContext";
import "./ServiceUpdate.scss";

const ServiceUpdate = ({ serviceId, onClose, onSuccess, onServiceLoaded }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);
  const { showToast } = useToast();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    isActive: true,
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const ImgDefault = "https://static-00.iconduck.com/assets.00/wrench-icon-2047x2048-jyerjpd9.png";
  const maxCharacters = 200;

  const t = {
    editService: { en: "Edit Service", kh: "កែសម្រួលសេវាកម្ម", zh: "编辑服务" },
    serviceName: { en: "Service Title", kh: "ចំណងជើងសេវាកម្ម", zh: "服务标题" },
    description: { en: "Description", kh: "ការពិពណ៌នា", zh: "描述" },
    price: { en: "Price ($)", kh: "តម្លៃ ($)", zh: "价格 ($)" },
    saveChanges: { en: "Save Changes", kh: "រក្សាទុកការផ្លាស់ប្តូរ", zh: "保存修改" },
    cancel: { en: "Cancel", kh: "បោះបង់", zh: "取消" },
    uploadTitle: { en: "Service Cover Image", kh: "រូបភាពគម្របសេវាកម្ម", zh: "服务封面图片" },
    uploading: { en: "Uploading image...", kh: "កំពុងបញ្ចូលរូបភាព...", zh: "正在上传图片..." },
    uploadSuccess: { en: "Image uploaded successfully!", kh: "បញ្ចូលរូបភាពបានជោគជ័យ!", zh: "图片上传成功！" },
    uploadError: { en: "Upload failed (Max 2MB)", kh: "ការបញ្ចូលរូបភាពបរាជ័យ (ទំហំធំបំផុត 2MB)", zh: "上传失败（最大 2MB）" },
    loadingText: { en: "Updating...", kh: "កំពុងធ្វើបច្ចុប្បន្នភាព...", zh: "正在更新..." },
    changeImage: { en: "Change Image", kh: "ប្តូររូបភាព", zh: "更换图片" },
    statusLabel: { en: "Service Status", kh: "ស្ថានភាពសេវាកម្ម", zh: "服务状态" },
    activeLabel: { en: "Active (Visible in marketplace)", kh: "សកម្ម (បង្ហាញនៅលើផ្សារ)", zh: "上架（在市场中可见）" },
    draftLabel: { en: "Draft (Hidden from marketplace)", kh: "ព្រាង (លាក់ពីផ្សារ)", zh: "下架（从市场隐藏）" }
  };

  const getLabel = (key) => t[key]?.[language] || t[key]?.["en"];

  useEffect(() => {
    const fetchService = async () => {
      try {
        setFetching(true);
        const res = await fetch(`/api/service/get/${serviceId}`);
        const responseData = await res.json();
        if (responseData.success === false) {
          setError(responseData.message);
          return;
        }
        const serviceData = responseData.data || responseData;
        setFormData({
          name: serviceData.name || "",
          description: serviceData.description || "",
          price: serviceData.price || "",
          image: serviceData.image || "",
          isActive: serviceData.isActive !== false,
        });
        if (onServiceLoaded) onServiceLoaded(serviceData.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  useEffect(() => {
    if (file) {
      handleImageUpload(file);
    }
  }, [file]);

  const handleImageUpload = (file) => {
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

      const res = await fetch(`/api/service/update/${serviceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        showToast(data.message, "error");
        setLoading(false);
        return;
      }
      setLoading(false);
      showToast(
        language === "kh" 
          ? "បានកែសម្រួលសេវាកម្មដោយជោគជ័យ!" 
          : language === "zh" 
            ? "服务更新成功！" 
            : "Service updated successfully!", 
        "success"
      );
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="service-update-fetching">
        <FaSpinner className="spin loading-icon" />
        <span>Loading service data...</span>
      </div>
    );
  }

  return (
    <div className={`service-create-container ${theme}`}>
      {/* Header */}
      <header className="service-create-header">
        <h1 className="header-title">{getLabel("editService")}</h1>
        <p className="header-subtitle">Modify the details to update your service listing.</p>
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
              placeholder={getLabel("serviceName")}
              required
            />
          </div>

          <div className="input-group textarea-group">
            <span className="input-icon"><FaFileAlt /></span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={getLabel("description")}
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
              placeholder={getLabel("price")}
              required
            />
          </div>

          <div className="input-group status-input-group">
            <span className="status-label-text">{getLabel("statusLabel")}</span>
            <div className="status-toggle-control">
              <label className="toggle-switch-wrapper">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className={`status-description ${formData.isActive ? "active" : "draft"}`}>
                {formData.isActive ? getLabel("activeLabel") : getLabel("draftLabel")}
              </span>
            </div>
          </div>

          {error && <div className="error-message-box">{error}</div>}

          {/* Action buttons */}
          <div className="edit-actions-row">
            <button type="button" className="cancel-service-btn" onClick={onClose} disabled={loading}>
              <span>{getLabel("cancel")}</span>
            </button>
            <button type="submit" className="submit-service-btn" disabled={loading}>
              {loading ? <FaSpinner className="spin" /> : <FaSave />}
              <span>{loading ? getLabel("loadingText") : getLabel("saveChanges")}</span>
            </button>
          </div>
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
                  <span>{getLabel("changeImage")}</span>
                </div>
              </div>
            ) : (
              <div className="dropzone-placeholder">
                <FaCloudUploadAlt className="placeholder-icon" />
                <span className="placeholder-prompt">Click to upload cover image</span>
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

export default ServiceUpdate;
