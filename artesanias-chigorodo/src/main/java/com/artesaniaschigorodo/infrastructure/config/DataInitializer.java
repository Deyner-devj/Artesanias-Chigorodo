package com.artesaniaschigorodo.infrastructure.config;

import com.artesaniaschigorodo.domain.models.category.Category;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.in.AuthPort;
import com.artesaniaschigorodo.domain.ports.out.CategoryPort;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserPort UserPort;
    private final AuthPort AuthPort;
    private final ProductPort ProductPort;
    private final CategoryPort CategoryPort;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@example.com";
        User admin;
        if (!UserPort.existsByEmail(adminEmail)) {
            admin = User.builder()
                    .fullName("Admin Test")
                    .email(adminEmail)
                    .password("Admin123!")
                    .role(Role.ADMIN)
                    .build();
            admin = AuthPort.register(admin);
            System.out.println("DataInitializer: usuario admin creado -> " + adminEmail);
        } else {
            admin = UserPort.findByEmail(adminEmail).orElseThrow();
            System.out.println("DataInitializer: usuario admin ya existe -> " + adminEmail);
        }

        seedProducts(admin);
        seedCategories();
    }

    private void seedProducts(User admin) {
        if (!ProductPort.findAll().isEmpty()) {
            return;
        }

        List<Product> products = List.of(
                Product.builder()
                        .name("Mochila Artesanal de Yute")
                        .description("Mochila hecha a mano con fibras naturales y bordados tradicionales.")
                        .price(120000.0)
                        .sellerId(admin.getId())
                        .sellerName(admin.getFullName())
                        .rating(4.8)
                        .reviewsCount(12)
                        .imageUrls(List.of("/frontend/img/productos/mochila-yute.jpg"))
                        .colors(List.of("Natural", "Negro"))
                        .category(com.artesaniaschigorodo.domain.models.enums.Category.ACCESSORIES)
                        .stock(20)
                        .build(),
                Product.builder()
                        .name("Juego de Cerámica Decorativa")
                        .description("Set de piezas de cerámica esmaltada para decorar el hogar.")
                        .price(95000.0)
                        .sellerId(admin.getId())
                        .sellerName(admin.getFullName())
                        .rating(4.9)
                        .reviewsCount(8)
                        .imageUrls(List.of("/frontend/img/productos/ceramica-decorativa.jpg"))
                        .colors(List.of("Blanco", "Azul"))
                        .category(com.artesaniaschigorodo.domain.models.enums.Category.CERAMICS)
                        .stock(15)
                        .build(),
                Product.builder()
                        .name("Collar Artesanal de Chaquiras")
                        .description("Collar hecho con cuentas de chaquira y diseño regional.")
                        .price(69000.0)
                        .sellerId(admin.getId())
                        .sellerName(admin.getFullName())
                        .rating(4.7)
                        .reviewsCount(5)
                        .imageUrls(List.of("/frontend/img/productos/collar-chaquira.jpg"))
                        .colors(List.of("Multicolor"))
                        .category(com.artesaniaschigorodo.domain.models.enums.Category.JEWELRY)
                        .stock(12)
                        .build()
        );

        products.forEach(ProductPort::save);
        System.out.println("DataInitializer: productos iniciales sembrados -> " + products.size());
    }

    private void seedCategories() {
        if (!CategoryPort.findAll().isEmpty()) {
            return;
        }

        List<Category> categories = List.of(
                Category.builder()
                        .code(com.artesaniaschigorodo.domain.models.enums.Category.TEXTILES.name())
                        .name("Tejidos")
                        .description("Piezas tejidas a mano por artesanos colombianos.")
                        .build(),
                Category.builder()
                        .code(com.artesaniaschigorodo.domain.models.enums.Category.CERAMICS.name())
                        .name("Cerámica")
                        .description("Artesanías en barro y cerámica de acabado único.")
                        .build(),
                Category.builder()
                        .code(com.artesaniaschigorodo.domain.models.enums.Category.JEWELRY.name())
                        .name("Joyería")
                        .description("Joyería artesanal elaborada con detalle.")
                        .build(),
                Category.builder()
                        .code(com.artesaniaschigorodo.domain.models.enums.Category.WOODWORK.name())
                        .name("Madera")
                        .description("Trabajos en madera tallada y decorativa.")
                        .build(),
                Category.builder()
                        .code(com.artesaniaschigorodo.domain.models.enums.Category.HOME_DECOR.name())
                        .name("Hogar y Decoración")
                        .description("Decoración artesanal para el hogar.")
                        .build(),
                Category.builder()
                        .code(com.artesaniaschigorodo.domain.models.enums.Category.ACCESSORIES.name())
                        .name("Accesorios")
                        .description("Accesorios hechos a mano para uso diario.")
                        .build()
        );

        categories.forEach(CategoryPort::save);
        System.out.println("DataInitializer: categorías iniciales sembradas -> " + categories.size());
    }
}
