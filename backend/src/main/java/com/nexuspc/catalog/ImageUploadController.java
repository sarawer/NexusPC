package com.nexuspc.catalog;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/uploads")
@PreAuthorize("hasRole('ADMIN')")
public class ImageUploadController {
    private final Path uploadDirectory;

    public ImageUploadController(@Value("${app.upload-dir:uploads}") String uploadDir) {
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty() || file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Please upload a valid image file");
        }
        Files.createDirectories(uploadDirectory);
        String original = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
        String extension = original.contains(".") ? original.substring(original.lastIndexOf('.')).toLowerCase() : ".jpg";
        String filename = UUID.randomUUID() + extension;
        Files.copy(file.getInputStream(), uploadDirectory.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        return Map.of("url", "/uploads/" + filename);
    }
}
