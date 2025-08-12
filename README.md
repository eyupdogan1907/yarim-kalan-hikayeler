# Yarım Kalan Hikayeler – Profil Demo

Basit bir giriş (login) ve profil görüntüleme sayfası.

## Canlı
GitHub Pages: https://<kullanici-adin>.github.io/yarim-kalan-hikayeler/login.html

## Yapı
- data/users.json — Kullanıcı listesi
- images/ — Profil görselleri (png/jpg)
- login.html — Kullanıcı seçimi, seçim localStorage'a kaydedilir
- profil.html — Seçilen kullanıcının detayları

## Nasıl Çalışır?
1. login.html'i aç, kullanıcı seç, *Giriş* de.
2. Seçilen id localStorage.secilenKullanici olarak kaydedilir.
3. profil.html açılır; data/users.json içinden o id bulunur ve ekrana basılır.
4. Fotoğraf yüklenemezse otomatik *placeholder* gösterilir.

## Notlar
- Değişiklik sonrası tarayıcıyı *Ctrl+F5* ile yenileyin (cache temizleme).
- Yeni kullanıcı eklemek için data/users.json dosyasına obje ekleyin ve görseli images/ klasörüne koyun.
