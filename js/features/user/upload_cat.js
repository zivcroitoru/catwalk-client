import { APP_URL } from "../../main.js";

/*-----------------------------------------------------------------------------
  upload.js
-----------------------------------------------------------------------------*/
import { $, setDisplay } from '../../core/utils.js';
import { toggleUploadCat } from '../ui/popups.js';
import { addCatToCarousel } from '../ui/carousel.js';

export async function uploadCat() {
  const file = $("catFileInput").files[0];
  if (!file) return alert("Pick a file first 🙂");

  const form = new FormData();
  form.append("catImage", file);
  const res = await fetch(`${APP_URL}/api/cats`, { method: "POST", body: form });
  if (!res.ok) return alert("Upload failed");
  const { url, name } = await res.json();
  addCatToCarousel(url, name || "New Cat");
  toggleUploadCat();
}

export function handleCatFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  $("uploadPreview").src = URL.createObjectURL(file);
  setDisplay("uploadActions", true, "flex");
}

export const triggerReupload = () => $("catFileInput").click();
