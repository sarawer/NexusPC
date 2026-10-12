package com.nexuspc;
import com.nexuspc.catalog.category.Category;
import com.nexuspc.catalog.category.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.nexuspc.payment.BkashProperties;
import com.nexuspc.payment.StripeProperties;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableAsync
@EnableConfigurationProperties({BkashProperties.class, StripeProperties.class})
public class NexusPcApplication {
    @Bean
    CommandLineRunner seedDefaultCategories(CategoryRepository repository) {
        return args -> {
            List<Category> defaults = List.of(
                    new Category("Processor", "cpu", "Intel & AMD desktop and laptop processors", "Cpu", null),
                    new Category("Graphics Card", "gpu", "NVIDIA & AMD graphics cards", "Monitor", null),
                    new Category("Motherboard", "motherboard", "ATX, mATX, and ITX motherboards", "CircuitBoard", null),
                    new Category("RAM", "ram", "DDR4 and DDR5 memory", "MemoryStick", null),
                    new Category("SSD", "ssd", "NVMe and SATA solid state drives", "HardDrive", null),
                    new Category("Hard Drive", "hdd", "High-capacity hard drives", "Database", null),
                    new Category("Power Supply", "psu", "Certified power supplies", "Zap", null),
                    new Category("CPU Cooler", "cpu-cooler", "Air and liquid CPU coolers", "Wind", null),
                    new Category("PC Case", "case", "PC cases for every build", "Box", null),
                    new Category("Case Fan", "case-fan", "ARGB and PWM case fans", "Fan", null),
                    new Category("Monitor", "monitor", "Gaming and professional displays", "Monitor", null),
                    new Category("Keyboard", "keyboard", "Mechanical and membrane keyboards", "Keyboard", null),
                    new Category("Mouse", "mouse", "Gaming and office mice", "Mouse", null),
                    new Category("Headset", "headset", "Gaming and studio audio", "Headphones", null),
                    new Category("Accessories", "accessories", "PC accessories and cables", "Package", null)
            );
            defaults.forEach(category -> {
                if (!repository.existsBySlug(category.getSlug())) repository.save(category);
            });
        };
    }
    public static void main(String[] args) {
        SpringApplication.run(NexusPcApplication.class, args);
    }
}
