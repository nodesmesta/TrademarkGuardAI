export const EXTRACTION_PROMPT = `
Anda adalah seorang ahli web scraping yang sangat cerdas. Tugas Anda adalah menganalisis konten HTML mentah dan mengekstrak informasi spesifik yang diminta. Anda harus mengabaikan semua skrip, gaya, dan elemen yang tidak relevan, dan fokus hanya pada konten tekstual yang terlihat oleh pengguna.
Konteks:
Saya sedang memantau web untuk mencari potensi pelanggaran merek dagang untuk merek "{trademark}".
Konten HTML:
---
{html_content}
---
Instruksi:
Berdasarkan konten HTML di atas, temukan dan ekstrak informasi berikut. Kembalikan HANYA JSON yang valid. Jika sebuah informasi tidak dapat ditemukan, kembalikan nilai null untuk kunci tersebut.
1. "username": Nama pengguna atau akun yang membuat postingan/daftar ini.
2. "content": Teks utama dari postingan atau deskripsi produk.
3. "source_url": URL langsung ke postingan atau produk ini jika dapat ditemukan.
4. "mentions_trademark": Boolean (true/false) apakah teks secara eksplisit menyebutkan merek "{trademark}".
5. "potential_violation_reason": Jelaskan secara singkat dalam satu kalimat mengapa ini BISA JADI pelanggaran (misalnya, "menjual produk", "menggunakan logo dalam gambar profil", "nama akun mirip").
Format JSON yang diharapkan:
{
  "username": "...",
  "content": "...",
  "source_url": "...",
  "mentions_trademark": true | false,
  "potential_violation_reason": "..."
}
`;
