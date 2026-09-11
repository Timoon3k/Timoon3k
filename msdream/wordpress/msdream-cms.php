<?php
/**
 * Plugin Name:  MSdream — model treści
 * Description:  Rejestruje typy treści, pola i endpointy REST używane przez witrynę MSdream (headless). Odświeża też cache Next.js po każdej zmianie treści.
 * Version:      1.0.0
 * Author:       MSdream
 * Text Domain:  msdream
 * Requires PHP: 8.0
 *
 * ---------------------------------------------------------------------------
 * Dlaczego wtyczka, a nie klikanie w panelu?
 *
 * Model treści jest kodem: leży w repozytorium, przechodzi code review i wraca
 * po awarii razem z resztą projektu. Gdyby typy treści i pola były klikane
 * w panelu (albo trzymane w płatnym ACF), odtworzenie CMS-u na nowym serwerze
 * byłoby ręczną robotą, której nikt nie pamięta po roku.
 *
 * Wtyczka nie wymaga ŻADNYCH płatnych dodatków — korzysta wyłącznie z API
 * rdzenia WordPressa (register_post_type, register_post_meta, meta boxy).
 * ---------------------------------------------------------------------------
 */

declare( strict_types = 1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Bezpośrednie wywołanie pliku — kończymy.
}

const MSDREAM_VERSION       = '1.0.0';
const MSDREAM_SETTINGS_KEY  = 'msdream_settings';

/* ===========================================================================
 * 1. Typy treści
 * ======================================================================== */

/**
 * Definicje wszystkich typów treści w jednym miejscu.
 *
 * @return array<string, array<string, mixed>>
 */
function msdream_post_types(): array {
	return array(
		'msd_usluga'     => array(
			'singular' => 'Usługa',
			'plural'   => 'Oferta',
			'icon'     => 'dashicons-tickets-alt',
			'supports' => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
		),
		'msd_instruktor' => array(
			'singular' => 'Instruktor',
			'plural'   => 'Instruktorzy',
			'icon'     => 'dashicons-groups',
			'supports' => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
		),
		'msd_galeria'    => array(
			'singular' => 'Zdjęcie',
			'plural'   => 'Galeria',
			'icon'     => 'dashicons-format-gallery',
			'supports' => array( 'title', 'thumbnail', 'page-attributes' ),
		),
		'msd_opinia'     => array(
			'singular' => 'Opinia',
			'plural'   => 'Opinie',
			'icon'     => 'dashicons-star-filled',
			'supports' => array( 'title', 'editor', 'page-attributes' ),
		),
		'msd_faq'        => array(
			'singular' => 'Pytanie',
			'plural'   => 'FAQ',
			'icon'     => 'dashicons-editor-help',
			'supports' => array( 'title', 'editor', 'page-attributes' ),
		),
		'msd_kon'        => array(
			'singular' => 'Koń',
			'plural'   => 'Konie',
			'icon'     => 'dashicons-pets',
			'supports' => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
		),
		'msd_poradnik'   => array(
			'singular' => 'Wpis',
			'plural'   => 'Poradnik',
			'icon'     => 'dashicons-welcome-write-blog',
			'supports' => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
		),
		'msd_dokument'   => array(
			'singular' => 'Dokument',
			'plural'   => 'Dokumenty prawne',
			'icon'     => 'dashicons-media-text',
			'supports' => array( 'title', 'editor' ),
		),
	);
}

add_action( 'init', 'msdream_register_post_types' );
function msdream_register_post_types(): void {
	foreach ( msdream_post_types() as $slug => $config ) {
		register_post_type(
			$slug,
			array(
				'labels'             => array(
					'name'          => $config['plural'],
					'singular_name' => $config['singular'],
					'add_new_item'  => sprintf( 'Dodaj: %s', $config['singular'] ),
					'edit_item'     => sprintf( 'Edytuj: %s', $config['singular'] ),
					'search_items'  => sprintf( 'Szukaj w: %s', $config['plural'] ),
					'not_found'     => 'Nie znaleziono żadnych pozycji.',
					'menu_name'     => $config['plural'],
				),
				'public'             => true,
				// Treść wyświetla Next.js — WordPress nie generuje własnych stron.
				'publicly_queryable' => false,
				'show_ui'            => true,
				'show_in_menu'       => true,
				'show_in_rest'       => true,
				'menu_icon'          => $config['icon'],
				'supports'           => $config['supports'],
				'has_archive'        => false,
				'rewrite'            => false,
				'hierarchical'       => false,
			)
		);
	}
}

/* ===========================================================================
 * 2. Pola dodatkowe
 * ======================================================================== */

/**
 * Definicje pól: typ treści → lista pól.
 *
 * `type` steruje kontrolką w panelu, `rest` typem w REST API.
 *
 * @return array<string, array<int, array<string, mixed>>>
 */
function msdream_fields(): array {
	return array(
		'msd_usluga'     => array(
			array(
				'key'     => 'msd_category',
				'label'   => 'Kategoria',
				'type'    => 'select',
				'options' => array( 'jazda-konna' => 'Jazda konna', 'tufting' => 'Warsztaty tuftingu' ),
				'hint'    => 'Decyduje, w której części oferty pojawi się usługa.',
			),
			array(
				'key'   => 'msd_tagline',
				'label' => 'Hasło (jedno zdanie)',
				'type'  => 'text',
				'hint'  => 'Krótkie zdanie widoczne pod nazwą zajęć, np. „Jeden jeździec, jeden instruktor".',
			),
			array(
				'key'   => 'msd_price',
				'label' => 'Cena (PLN)',
				'type'  => 'number',
				'hint'  => 'Sama liczba, bez „zł". Zostaw puste, jeśli cena jest ustalana indywidualnie — strona pokaże wtedy informację zamiast liczby.',
			),
			array(
				'key'   => 'msd_price_note',
				'label' => 'Dopisek przy cenie',
				'type'  => 'text',
				'hint'  => 'Np. „/ 60 min", „/ os.", „od".',
			),
			array(
				'key'   => 'msd_duration',
				'label' => 'Czas trwania (minuty)',
				'type'  => 'number',
				'hint'  => 'Sama liczba, np. 60.',
			),
			array(
				'key'   => 'msd_audience',
				'label' => 'Dla kogo',
				'type'  => 'text',
				'hint'  => 'Np. „Dzieci od ok. 4 lat, bez doświadczenia".',
			),
			array(
				'key'   => 'msd_includes',
				'label' => 'Co obejmują zajęcia',
				'type'  => 'textarea',
				'hint'  => 'Jedna pozycja w każdej linii.',
			),
			array(
				'key'   => 'msd_requirements',
				'label' => 'O czym trzeba wiedzieć / ograniczenia',
				'type'  => 'textarea',
				'hint'  => 'Jedna pozycja w każdej linii.',
			),
			array(
				'key'   => 'msd_bookero_service_id',
				'label' => 'ID usługi w Bookero',
				'type'  => 'text',
				'hint'  => 'Opcjonalne. Pozwala otworzyć kalendarz od razu na tej usłudze. ID znajdziesz w panelu Bookero.',
			),
			array(
				'key'   => 'msd_featured',
				'label' => 'Wyróżnij na stronie głównej',
				'type'  => 'checkbox',
			),
		),
		'msd_instruktor' => array(
			array( 'key' => 'msd_role', 'label' => 'Funkcja', 'type' => 'text', 'hint' => 'Np. „Instruktor jazdy konnej".' ),
			array( 'key' => 'msd_experience', 'label' => 'Doświadczenie', 'type' => 'text', 'hint' => 'Np. „12 lat pracy z dziećmi, instruktor rekreacji PZJ".' ),
			array( 'key' => 'msd_specialization', 'label' => 'Specjalizacje', 'type' => 'textarea', 'hint' => 'Jedna w każdej linii.' ),
			array( 'key' => 'msd_socials', 'label' => 'Social media', 'type' => 'textarea', 'hint' => 'Jedna w linii, format: Instagram|https://instagram.com/nazwa' ),
		),
		'msd_galeria'    => array(
			array(
				'key'     => 'msd_span',
				'label'   => 'Rozmiar w galerii',
				'type'    => 'select',
				'options' => array( 'hero' => 'Bardzo duże', 'wide' => 'Szerokie', 'tall' => 'Wysokie (pion)', 'square' => 'Kwadrat' ),
				'hint'    => 'Mieszaj rozmiary — dzięki temu galeria nie wygląda jak równa siatka.',
			),
			array( 'key' => 'msd_caption', 'label' => 'Podpis', 'type' => 'text' ),
		),
		'msd_opinia'     => array(
			array( 'key' => 'msd_author', 'label' => 'Autor opinii', 'type' => 'text', 'hint' => 'Imię tak, jak podpisano opinię w Google.' ),
			array( 'key' => 'msd_rating', 'label' => 'Ocena (1–5)', 'type' => 'number', 'hint' => 'Przepisz rzeczywistą ocenę z Google. Nie dodawaj opinii, których nie wystawili klienci.' ),
			array( 'key' => 'msd_date', 'label' => 'Data wystawienia', 'type' => 'date' ),
		),
		'msd_faq'        => array(
			array(
				'key'     => 'msd_topic',
				'label'   => 'Temat',
				'type'    => 'select',
				'options' => array(
					'ogolne'      => 'Ogólne',
					'jazda-konna' => 'Jazda konna',
					'dzieci'      => 'Dzieci',
					'tufting'     => 'Tufting',
					'rezerwacja'  => 'Rezerwacja i płatności',
				),
				'hint'    => 'Decyduje, na której podstronie pojawi się pytanie.',
			),
		),
		'msd_kon'        => array(
			array( 'key' => 'msd_breed', 'label' => 'Rasa', 'type' => 'text' ),
			array( 'key' => 'msd_character', 'label' => 'Charakter', 'type' => 'textarea', 'hint' => 'Kilka zdań: dla kogo ten koń jest odpowiedni.' ),
		),
	);
}

add_action( 'init', 'msdream_register_meta' );
function msdream_register_meta(): void {
	foreach ( msdream_fields() as $post_type => $fields ) {
		foreach ( $fields as $field ) {
			register_post_meta(
				$post_type,
				$field['key'],
				array(
					'type'              => 'checkbox' === $field['type'] ? 'boolean' : 'string',
					'single'            => true,
					'default'           => 'checkbox' === $field['type'] ? false : '',
					// Kluczowe: bez tego pola nie wyjdą przez REST do Next.js.
					'show_in_rest'      => true,
					'sanitize_callback' => 'checkbox' === $field['type']
						? 'rest_sanitize_boolean'
						: ( 'textarea' === $field['type'] ? 'sanitize_textarea_field' : 'sanitize_text_field' ),
					'auth_callback'     => static fn (): bool => current_user_can( 'edit_posts' ),
				)
			);
		}
	}
}

/* ===========================================================================
 * 3. Panel edycji — meta boxy
 * ======================================================================== */

add_action( 'add_meta_boxes', 'msdream_add_meta_boxes' );
function msdream_add_meta_boxes(): void {
	foreach ( msdream_fields() as $post_type => $fields ) {
		add_meta_box(
			'msdream_fields',
			'Szczegóły',
			'msdream_render_meta_box',
			$post_type,
			'normal',
			'high'
		);
	}
}

function msdream_render_meta_box( WP_Post $post ): void {
	$fields = msdream_fields()[ $post->post_type ] ?? array();
	wp_nonce_field( 'msdream_save_fields', 'msdream_nonce' );

	echo '<style>.msdream-field{margin:0 0 18px}.msdream-field label{display:block;font-weight:600;margin-bottom:4px}.msdream-field input[type=text],.msdream-field input[type=number],.msdream-field input[type=date],.msdream-field textarea,.msdream-field select{width:100%;max-width:640px}.msdream-field textarea{min-height:110px}.msdream-hint{color:#666;font-size:12px;margin-top:4px;max-width:640px}</style>';

	foreach ( $fields as $field ) {
		$value = get_post_meta( $post->ID, $field['key'], true );
		$id    = esc_attr( $field['key'] );

		echo '<div class="msdream-field">';
		printf( '<label for="%s">%s</label>', $id, esc_html( $field['label'] ) );

		switch ( $field['type'] ) {
			case 'textarea':
				printf(
					'<textarea id="%s" name="%s">%s</textarea>',
					$id,
					$id,
					esc_textarea( (string) $value )
				);
				break;

			case 'select':
				printf( '<select id="%s" name="%s">', $id, $id );
				echo '<option value="">— wybierz —</option>';
				foreach ( $field['options'] as $option_value => $option_label ) {
					printf(
						'<option value="%s"%s>%s</option>',
						esc_attr( (string) $option_value ),
						selected( $value, $option_value, false ),
						esc_html( (string) $option_label )
					);
				}
				echo '</select>';
				break;

			case 'checkbox':
				printf(
					'<input type="checkbox" id="%s" name="%s" value="1"%s>',
					$id,
					$id,
					checked( (bool) $value, true, false )
				);
				break;

			default:
				printf(
					'<input type="%s" id="%s" name="%s" value="%s">',
					esc_attr( $field['type'] ),
					$id,
					$id,
					esc_attr( (string) $value )
				);
		}

		if ( ! empty( $field['hint'] ) ) {
			printf( '<p class="msdream-hint">%s</p>', esc_html( $field['hint'] ) );
		}

		echo '</div>';
	}
}

add_action( 'save_post', 'msdream_save_fields', 10, 2 );
function msdream_save_fields( int $post_id, WP_Post $post ): void {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! isset( $_POST['msdream_nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['msdream_nonce'] ) ), 'msdream_save_fields' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$fields = msdream_fields()[ $post->post_type ] ?? array();

	foreach ( $fields as $field ) {
		$key = $field['key'];

		if ( 'checkbox' === $field['type'] ) {
			update_post_meta( $post_id, $key, isset( $_POST[ $key ] ) );
			continue;
		}

		if ( ! isset( $_POST[ $key ] ) ) {
			continue;
		}

		$raw   = wp_unslash( $_POST[ $key ] );
		$clean = 'textarea' === $field['type']
			? sanitize_textarea_field( $raw )
			: sanitize_text_field( $raw );

		update_post_meta( $post_id, $key, $clean );
	}
}

/* ===========================================================================
 * 4. Ustawienia witryny (dane firmy) + endpoint REST
 * ======================================================================== */

/** @return array<int, array<string, string>> */
function msdream_setting_fields(): array {
	return array(
		array( 'key' => 'legal_name', 'label' => 'Pełna nazwa firmy', 'hint' => 'Z CEIDG/KRS — trafia do danych strukturalnych.' ),
		array( 'key' => 'street', 'label' => 'Ulica i numer' ),
		array( 'key' => 'postal_code', 'label' => 'Kod pocztowy', 'hint' => 'Format 05-092.' ),
		array( 'key' => 'phone', 'label' => 'Telefon', 'hint' => 'Format +48 XXX XXX XXX.' ),
		array( 'key' => 'email', 'label' => 'E-mail' ),
		array( 'key' => 'tax_id', 'label' => 'NIP' ),
		array( 'key' => 'latitude', 'label' => 'Szerokość geograficzna', 'hint' => 'Z Google Maps, np. 52.3312. Potrzebne do mapy i danych lokalnych.' ),
		array( 'key' => 'longitude', 'label' => 'Długość geograficzna', 'hint' => 'Z Google Maps, np. 20.8865.' ),
		array( 'key' => 'google_place_id', 'label' => 'Place ID wizytówki Google', 'hint' => 'Potrzebne do linku z opiniami.' ),
	);
}

add_action( 'admin_menu', 'msdream_settings_page' );
function msdream_settings_page(): void {
	add_menu_page(
		'Ustawienia witryny',
		'Ustawienia witryny',
		'manage_options',
		'msdream-settings',
		'msdream_render_settings_page',
		'dashicons-admin-site-alt3',
		3
	);
}

function msdream_render_settings_page(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$settings = get_option( MSDREAM_SETTINGS_KEY, array() );

	if ( isset( $_POST['msdream_settings_nonce'] ) && wp_verify_nonce( sanitize_key( wp_unslash( $_POST['msdream_settings_nonce'] ) ), 'msdream_save_settings' ) ) {
		foreach ( msdream_setting_fields() as $field ) {
			$key              = $field['key'];
			$settings[ $key ] = isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : '';
		}
		$settings['socials'] = isset( $_POST['socials'] )
			? sanitize_textarea_field( wp_unslash( $_POST['socials'] ) )
			: '';

		update_option( MSDREAM_SETTINGS_KEY, $settings );
		msdream_revalidate( 'wp:settings' );
		echo '<div class="notice notice-success"><p>Zapisano. Strona odświeży się w ciągu kilkunastu sekund.</p></div>';
	}

	echo '<div class="wrap"><h1>Ustawienia witryny</h1>';
	echo '<p>Te dane trafiają do stopki, sekcji kontaktu, mapy oraz danych strukturalnych Google. Puste pola nie są publikowane — lepiej zostawić pole puste niż wpisać dane orientacyjne.</p>';
	echo '<form method="post"><table class="form-table">';

	wp_nonce_field( 'msdream_save_settings', 'msdream_settings_nonce' );

	foreach ( msdream_setting_fields() as $field ) {
		$key   = esc_attr( $field['key'] );
		$value = esc_attr( (string) ( $settings[ $field['key'] ] ?? '' ) );

		printf( '<tr><th scope="row"><label for="%s">%s</label></th><td>', $key, esc_html( $field['label'] ) );
		printf( '<input type="text" class="regular-text" id="%s" name="%s" value="%s">', $key, $key, $value );
		if ( ! empty( $field['hint'] ) ) {
			printf( '<p class="description">%s</p>', esc_html( $field['hint'] ) );
		}
		echo '</td></tr>';
	}

	printf(
		'<tr><th scope="row"><label for="socials">Social media</label></th><td><textarea id="socials" name="socials" class="large-text" rows="4">%s</textarea><p class="description">Jeden profil w linii, format: Facebook|https://facebook.com/nazwa</p></td></tr>',
		esc_textarea( (string) ( $settings['socials'] ?? '' ) )
	);

	echo '</table>';
	submit_button( 'Zapisz ustawienia' );
	echo '</form></div>';
}

add_action( 'rest_api_init', 'msdream_register_rest_routes' );
function msdream_register_rest_routes(): void {
	register_rest_route(
		'msdream/v1',
		'/settings',
		array(
			'methods'             => 'GET',
			'callback'            => 'msdream_rest_settings',
			// Dane firmowe są publiczne (widnieją w stopce strony).
			'permission_callback' => '__return_true',
		)
	);
}

function msdream_rest_settings(): WP_REST_Response {
	$settings = get_option( MSDREAM_SETTINGS_KEY, array() );
	$socials  = array();

	foreach ( preg_split( '/\r?\n/', (string) ( $settings['socials'] ?? '' ) ) ?: array() as $line ) {
		$parts = array_map( 'trim', explode( '|', (string) $line, 2 ) );
		if ( 2 === count( $parts ) && '' !== $parts[0] && '' !== $parts[1] ) {
			$socials[] = array( 'label' => $parts[0], 'href' => $parts[1] );
		}
	}

	$payload = array( 'socials' => $socials );

	foreach ( msdream_setting_fields() as $field ) {
		$value = trim( (string) ( $settings[ $field['key'] ] ?? '' ) );
		// Pustych pól nie wysyłamy — Next.js traktuje ich brak jako
		// „dana wciąż do uzupełnienia" i nie publikuje jej w schema.org.
		if ( '' !== $value ) {
			$payload[ $field['key'] ] = $value;
		}
	}

	return new WP_REST_Response( $payload, 200 );
}

/* ===========================================================================
 * 5. Odświeżanie cache Next.js
 * ======================================================================== */

/**
 * Po każdej zmianie treści wysyłamy sygnał do Next.js, żeby przebudował
 * odpowiednie strony. Bez tego zmiana w panelu byłaby widoczna dopiero
 * po wygaśnięciu cache'u (godzina).
 *
 * Adres i sekret ustawia się w `wp-config.php`:
 *   define( 'MSDREAM_REVALIDATE_URL', 'https://msdream.pl/api/revalidate' );
 *   define( 'MSDREAM_REVALIDATE_SECRET', '…' );
 */
function msdream_revalidate( string $tag ): void {
	if ( ! defined( 'MSDREAM_REVALIDATE_URL' ) || ! defined( 'MSDREAM_REVALIDATE_SECRET' ) ) {
		return;
	}

	wp_remote_post(
		MSDREAM_REVALIDATE_URL,
		array(
			// Nieblokujące: redaktor nie czeka na odpowiedź Next.js.
			'blocking' => false,
			'timeout'  => 5,
			'headers'  => array(
				'Content-Type'      => 'application/json',
				'x-msdream-secret'  => MSDREAM_REVALIDATE_SECRET,
			),
			'body'     => wp_json_encode( array( 'tag' => $tag ) ),
		)
	);
}

/** Mapowanie typu treści na tag cache'u po stronie Next.js. */
function msdream_tag_for_post_type( string $post_type ): ?string {
	return array(
		'msd_usluga'     => 'wp:services',
		'msd_instruktor' => 'wp:instructors',
		'msd_galeria'    => 'wp:gallery',
		'msd_opinia'     => 'wp:testimonials',
		'msd_faq'        => 'wp:faq',
		'msd_kon'        => 'wp:horses',
		'msd_poradnik'   => 'wp:guides',
		'msd_dokument'   => 'wp:legal',
	)[ $post_type ] ?? null;
}

add_action( 'save_post', 'msdream_revalidate_on_save', 20, 2 );
function msdream_revalidate_on_save( int $post_id, WP_Post $post ): void {
	if ( wp_is_post_revision( $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	$tag = msdream_tag_for_post_type( $post->post_type );
	if ( null !== $tag ) {
		msdream_revalidate( $tag );
	}
}

add_action( 'trashed_post', 'msdream_revalidate_on_delete' );
add_action( 'untrashed_post', 'msdream_revalidate_on_delete' );
add_action( 'deleted_post', 'msdream_revalidate_on_delete' );
function msdream_revalidate_on_delete( int $post_id ): void {
	$post = get_post( $post_id );
	if ( ! $post instanceof WP_Post ) {
		return;
	}

	$tag = msdream_tag_for_post_type( $post->post_type );
	if ( null !== $tag ) {
		msdream_revalidate( $tag );
	}
}

/* ===========================================================================
 * 6. Porządki w panelu
 * ======================================================================== */

add_action( 'admin_menu', 'msdream_tidy_admin', 999 );
function msdream_tidy_admin(): void {
	// Wpisy i komentarze nie są używane — headless WordPress serwuje
	// wyłącznie treść zdefiniowaną wyżej. Ukrywamy je, żeby nie mylić redaktora.
	remove_menu_page( 'edit.php' );
	remove_menu_page( 'edit-comments.php' );
}

add_filter( 'admin_footer_text', 'msdream_admin_footer' );
function msdream_admin_footer(): string {
	return 'Panel treści MSdream · instrukcja krok po kroku znajduje się w pliku <strong>CMS-GUIDE.md</strong> w repozytorium witryny.';
}
