import { useEffect, useRef, useState } from "react";
import { FaSave, FaTimes, FaPlusCircle } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import FormField from "../../components/formField/FormField";
import Label from "../../components/label/Label";
import { useSelector } from "react-redux";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import "./ServiceUpdate.scss";

const ServiceUpdate = ({ serviceId, onClose, onSuccess }) => {
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
    price: 0,
    image: "https://static-00.iconduck.com/assets.00/wrench-icon-2047x2048-jyerjpd9.png",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const ImgUrls = "https://static-00.iconduck.com/assets.00/wrench-icon-2047x2048-jyerjpd9.png";
  const maxCharacters = 200;

  const t = {
    editService: { en: "Edit Service", kh: "កែសម្រួលសេវាកម្ម", zh: "编辑服务" },
    serviceName: { en: "Service Name", kh: "ឈ្មោះសេវាកម្ម", zh: "服务名称" },
    description: { en: "Description", kh: "ការពិពណ៌នា", zh: "描述" },
    price: { en: "Price", kh: "តម្លៃ", zh: "价格" },
    saveChanges: { en: "Save Changes", kh: "រក្សាទុកការផ្លាស់ប្តូរ", zh: "保存修改" },
    cancel: { en: "Cancel", kh: "បោះបង់", zh: "取消" },
    uploading: { en: "Uploading image...", kh: "កំពុងបញ្ចូលរូបភាព...", zh: "正在上传图片..." },
    uploadSuccess: { en: "Image uploaded successfully!", kh: "បញ្ចូលរូបភាពបានជោគជ័យ!", zh: "图片上传成功！" },
    uploadError: { en: "Upload failed (Max 2MB)", kh: "ការបញ្ចូលរូបភាពបរាជ័យ (ទំហំធំបំផុត 2MB)", zh: "上传失败（最大 2MB）" },
    loadingText: { en: "Updating...", kh: "កំពុងធ្វើបច្ចុប្បន្នភាព...", zh: "正在更新..." },
    changeImage: { en: "Change Image", kh: "ប្តូររូបភាព", zh: "更换图片" }
  };

  const getLabel = (key) => t[key]?.[language] || t[key]?.["en"];

  useEffect(() => {
    const fetchService = async () => {
      try {
        setFetching(true);
        const res = await fetch(`/api/service/get/${serviceId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          image: data.image || ImgUrls,
        });
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
    if (name === "description" && value.length > 200) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/service/update/${serviceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="service-update-fetching">Loading service data...</div>;
  }

  return (
    <div className={`service-update-modal-content ${theme}`}>
      <div className="modal-header">
        <Label label={getLabel("editService")} />
        <button className="close-modal-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <form className="service-update-form" onSubmit={handleSubmit}>
        <div className="form-left">
          <div className="input-group">
            <FormField
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={getLabel("serviceName")}
              required
            />
          </div>

          <div className="input-group">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={getLabel("description")}
              required
              maxLength={200}
            />
            <span className="char-counter">
              {formData.description.length}/{maxCharacters}
            </span>
          </div>

          <div className="input-group">
            <FormField
              type="number"
              name="price"
              step="0.001"
              value={formData.price}
              onChange={handleChange}
              placeholder={getLabel("price")}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              {getLabel("cancel")}
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              <FaSave style={{ marginRight: "6px" }} />
              {loading ? getLabel("loadingText") : getLabel("saveChanges")}
            </button>
          </div>
        </div>

        <div className="form-right">
          <div className="image-preview-container">
            <img src={formData.image || ImgUrls} alt="Service preview" />
            <button type="button" className="change-img-btn" onClick={() => fileRef.current.click()}>
              <FaPlusCircle /> {getLabel("changeImage")}
            </button>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              ref={fileRef}
              hidden
              accept="image/*"
            />
            {filePerc > 0 && filePerc < 100 && (
              <span className="upload-status info">{getLabel("uploading")} {filePerc}%</span>
            )}
            {filePerc === 100 && !fileUploadError && (
              <span className="upload-status success">{getLabel("uploadSuccess")}</span>
            )}
            {fileUploadError && (
              <span className="upload-status error">{getLabel("uploadError")}</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceUpdate;
