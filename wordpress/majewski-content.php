<?php
/**
 * Plugin Name:  Majewski — treść dla frontendu
 * Description:  Typy treści i znormalizowane REST API dla strony w Next.js.
 * Version:      1.0.0
 * Author:       Tomasz Majewski
 * Requires PHP: 7.4
 *
 * Wgraj ten plik do `wp-content/mu-plugins/`. Katalog `mu-plugins` może nie
 * istnieć — wtedy go utwórz. Wtyczki „must-use" włączają się same, nie da się
 * ich przypadkiem wyłączyć w panelu i nie ma ich w liście do aktualizacji.
 *
 * Ten plik jest JEDYNYM miejscem, które wie, w czym wprowadzasz dane.
 * Frontend dostaje zawsze ten sam kształt JSON-a — bez względu na to, czy
 * pola pochodzą z ACF, Meta Boxa, Podsów, czy zwykłych pól własnych WP.
 * Zmieniasz wtyczkę do pól — poprawiasz `mj_field()` i nic więcej.
 */

if (!defined('ABSPATH')) {
    exit;
}

const MJ_NAMESPACE = 'majewski/v1';

/* -------------------------------------------------------------------------- */
/* Typy treści                                                                */
/* -------------------------------------------------------------------------- */

function mj_register_post_types(): void {
    $shared = [
        'public'       => true,
        'show_in_rest' => true,
        'has_archive'  => false,
        'supports'     => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'custom-fields'],
        'menu_icon'    => 'dashicons-portfolio',
    ];

    register_post_type('mj_project', $shared + [
        'labels' => [
            'name'          => 'Realizacje',
            'singular_name' => 'Realizacja',
            'add_new_item'  => 'Dodaj realizację',
            'edit_item'     => 'Edytuj realizację',
        ],
        'rewrite' => ['slug' => 'realizacje'],
    ]);

    register_post_type('mj_service', $shared + [
        'labels' => [
            'name'          => 'Usługi',
            'singular_name' => 'Usługa',
            'add_new_item'  => 'Dodaj usługę',
            'edit_item'     => 'Edytuj usługę',
        ],
        'menu_icon' => 'dashicons-hammer',
        'rewrite'   => ['slug' => 'uslugi'],
    ]);

    register_post_type('mj_faq', $shared + [
        'labels' => [
            'name'          => 'FAQ',
            'singular_name' => 'Zestaw FAQ',
            'add_new_item'  => 'Dodaj zestaw FAQ',
            'edit_item'     => 'Edytuj zestaw FAQ',
        ],
        'menu_icon' => 'dashicons-editor-help',
        'public'    => false,
        'show_ui'   => true,
    ]);

    register_post_type('mj_testimonial', $shared + [
        'labels' => [
            'name'          => 'Opinie',
            'singular_name' => 'Opinia',
            'add_new_item'  => 'Dodaj opinię',
            'edit_item'     => 'Edytuj opinię',
        ],
        'menu_icon' => 'dashicons-format-quote',
        'public'    => false,
        'show_ui'   => true,
    ]);
}
add_action('init', 'mj_register_post_types');

/* -------------------------------------------------------------------------- */
/* Odczyt pól — jedno miejsce, które zna wtyczkę do pól własnych              */
/* -------------------------------------------------------------------------- */

/**
 * Zwraca wartość pola niezależnie od tego, czym je wprowadzasz.
 * Kolejność: ACF → Meta Box → natywne pole własne WP.
 *
 * @param mixed $default wartość, gdy pola nie ma albo jest puste
 * @return mixed
 */
function mj_field(int $post_id, string $name, $default = null) {
    if (function_exists('get_field')) {
        $value = get_field($name, $post_id);
        if ($value !== null && $value !== false && $value !== '') {
            return $value;
        }
    }

    if (function_exists('rwmb_meta')) {
        $value = rwmb_meta($name, [], $post_id);
        if ($value !== null && $value !== false && $value !== '') {
            return $value;
        }
    }

    $value = get_post_meta($post_id, $name, true);
    if ($value !== '' && $value !== false && $value !== null) {
        return $value;
    }

    return $default;
}

/** Pole tekstowe — zawsze string, przycięty. */
function mj_text(int $post_id, string $name, string $default = ''): string {
    $value = mj_field($post_id, $name, $default);
    return is_scalar($value) ? trim((string) $value) : $default;
}

/**
 * Pole listowe — zawsze tablica stringów.
 * Akceptuje tablicę (ACF/Meta Box) albo tekst: jedna pozycja w wierszu,
 * ewentualnie po przecinku, gdy wierszy nie ma.
 */
function mj_list(int $post_id, string $name): array {
    $value = mj_field($post_id, $name, []);

    if (is_array($value)) {
        $flat = [];
        foreach ($value as $item) {
            if (is_scalar($item)) {
                $flat[] = trim((string) $item);
            } elseif (is_array($item)) {
                // Repeater z jednym polem — bierzemy pierwszą wartość wiersza.
                $first = reset($item);
                if (is_scalar($first)) {
                    $flat[] = trim((string) $first);
                }
            }
        }
        return array_values(array_filter($flat, 'strlen'));
    }

    if (!is_scalar($value)) {
        return [];
    }

    $text  = (string) $value;
    $parts = strpos($text, "\n") !== false ? preg_split('/\R/', $text) : explode(',', $text);

    return array_values(array_filter(array_map('trim', $parts ?: []), 'strlen'));
}

/**
 * Pole powtarzalne — tablica wierszy o zadanych kluczach.
 * Radzi sobie z ACF Repeater, Meta Box (group/clone) i Podsami, bo wszystkie
 * trafiają do PHP jako tablica tablic. Gdy pola nie ma, zwraca pustą tablicę.
 */
function mj_rows(int $post_id, string $name, array $keys): array {
    $value = mj_field($post_id, $name, []);
    if (!is_array($value)) {
        return [];
    }

    $rows = [];
    foreach ($value as $row) {
        if (!is_array($row)) {
            continue;
        }
        $mapped  = [];
        $hasData = false;
        foreach ($keys as $key) {
            $cell = $row[$key] ?? '';
            if (is_array($cell)) {
                $cell = implode("\n", array_filter(array_map('strval', $cell), 'strlen'));
            }
            $mapped[$key] = is_scalar($cell) ? trim((string) $cell) : '';
            if ($mapped[$key] !== '') {
                $hasData = true;
            }
        }
        if ($hasData) {
            $rows[] = $mapped;
        }
    }

    return $rows;
}

/**
 * Obrazek w kształcie, którego oczekuje `next/image`.
 * Przyjmuje ID załącznika, tablicę ACF albo URL.
 */
function mj_image($value): ?array {
    $id = null;

    if (is_numeric($value)) {
        $id = (int) $value;
    } elseif (is_array($value) && isset($value['ID'])) {
        $id = (int) $value['ID'];
    } elseif (is_array($value) && isset($value['id'])) {
        $id = (int) $value['id'];
    } elseif (is_string($value) && $value !== '') {
        // Sam adres — bez wymiarów next/image potrzebuje `fill`, więc podajemy 0.
        return ['src' => $value, 'alt' => '', 'width' => 0, 'height' => 0];
    }

    if (!$id) {
        return null;
    }

    $src = wp_get_attachment_image_src($id, 'full');
    if (!$src) {
        return null;
    }

    return [
        'src'    => $src[0],
        'alt'    => (string) get_post_meta($id, '_wp_attachment_image_alt', true),
        'width'  => (int) $src[1],
        'height' => (int) $src[2],
    ];
}

/** Obrazek wyróżniający wpisu. */
function mj_featured_image(int $post_id): ?array {
    $thumb = get_post_thumbnail_id($post_id);
    return $thumb ? mj_image($thumb) : null;
}

/** Sekcja case study: nagłówek + akapity. */
function mj_section(int $post_id, string $prefix): array {
    return [
        'heading' => mj_text($post_id, $prefix . '_heading'),
        'body'    => mj_list($post_id, $prefix . '_body'),
    ];
}

/** SEO — własne pola, a gdy ich nie ma, sensowne wartości z treści wpisu. */
function mj_seo(int $post_id, string $fallback_title, string $fallback_description): array {
    return [
        'title'       => mj_text($post_id, 'seo_title', $fallback_title),
        'description' => mj_text($post_id, 'seo_description', $fallback_description),
    ];
}

/* -------------------------------------------------------------------------- */
/* Serializacja                                                               */
/* -------------------------------------------------------------------------- */

function mj_project_json(WP_Post $post): array {
    $id      = $post->ID;
    $title   = get_the_title($post);
    $summary = mj_text($id, 'summary', wp_strip_all_tags(get_the_excerpt($post)));

    $gallery = [];
    $raw     = mj_field($id, 'gallery', []);
    if (is_array($raw)) {
        foreach ($raw as $item) {
            $image = mj_image(is_array($item) && isset($item['image']) ? $item['image'] : $item);
            if ($image) {
                $gallery[] = $image;
            }
        }
    }

    $price = mj_field($id, 'url', '');

    return [
        'slug'      => $post->post_name,
        'client'    => mj_text($id, 'client', $title),
        'domain'    => mj_text($id, 'domain'),
        'url'       => is_string($price) && $price !== '' ? $price : null,
        'title'     => $title,
        'summary'   => $summary,
        'role'      => mj_text($id, 'role'),
        'category'  => mj_text($id, 'category'),
        'tags'      => mj_list($id, 'tags'),
        'stack'     => mj_list($id, 'stack'),
        'accent'    => mj_text($id, 'accent', '#5ce1ff'),
        'cover'     => mj_featured_image($id) ?? mj_image(mj_field($id, 'cover', null)),
        'gallery'   => $gallery,
        'context'   => mj_text($id, 'context'),
        'challenge' => mj_section($id, 'challenge'),
        'solution'  => mj_section($id, 'solution'),
        'features'  => mj_rows($id, 'features', ['title', 'body']),
        'outcome'   => mj_list($id, 'outcome'),
        'featured'  => (bool) mj_field($id, 'featured', false),
        'seo'       => mj_seo($id, $title, $summary),
    ];
}

function mj_service_json(WP_Post $post): array {
    $id    = $post->ID;
    $price = mj_field($id, 'price_from', null);

    return [
        'slug'         => $post->post_name,
        'title'        => get_the_title($post),
        'tagline'      => mj_text($id, 'tagline'),
        'description'  => mj_text($id, 'description', wp_strip_all_tags(get_the_excerpt($post))),
        'deliverables' => mj_list($id, 'deliverables'),
        'priceFrom'    => is_numeric($price) ? (int) $price : null,
        'duration'     => mj_text($id, 'duration'),
        'index'        => mj_text($id, 'index', str_pad((string) ($post->menu_order + 1), 2, '0', STR_PAD_LEFT)),
    ];
}

function mj_post_json(WP_Post $post): array {
    $id         = $post->ID;
    $title      = get_the_title($post);
    $excerpt    = wp_strip_all_tags(get_the_excerpt($post));
    $categories = wp_get_post_categories($id, ['fields' => 'names']);

    return [
        'slug'        => $post->post_name,
        'title'       => $title,
        'excerpt'     => $excerpt,
        'publishedAt' => get_post_time('c', true, $post),
        'updatedAt'   => get_post_modified_time('c', true, $post),
        'category'    => $categories[0] ?? 'Artykuł',
        'cover'       => mj_featured_image($id),
        // Frontend zamienia ten HTML na własny, wąski markdown i renderuje
        // go jako elementy Reacta — nic z tej treści nie trafia do DOM jako HTML.
        'contentHtml' => apply_filters('the_content', $post->post_content),
        'seo'         => mj_seo($id, $title, $excerpt),
    ];
}

function mj_faq_json(WP_Post $post): array {
    return [
        'key'   => mj_text($post->ID, 'key', $post->post_name),
        'items' => mj_rows($post->ID, 'items', ['question', 'answer']),
    ];
}

function mj_testimonial_json(WP_Post $post): array {
    $id = $post->ID;

    return [
        'quote'  => mj_text($id, 'quote', wp_strip_all_tags($post->post_content)),
        'author' => mj_text($id, 'author', get_the_title($post)),
        'role'   => mj_text($id, 'role'),
        'source' => mj_text($id, 'source'),
    ];
}

/* -------------------------------------------------------------------------- */
/* Endpointy                                                                  */
/* -------------------------------------------------------------------------- */

/** @param callable $serializer */
function mj_collection(string $post_type, callable $serializer, array $args = []): array {
    $query = new WP_Query(array_merge([
        'post_type'              => $post_type,
        'post_status'            => 'publish',
        'posts_per_page'         => 100,
        'orderby'                => ['menu_order' => 'ASC', 'date' => 'DESC'],
        'no_found_rows'          => true,
        'update_post_term_cache' => false,
    ], $args));

    return array_map($serializer, $query->posts);
}

function mj_register_routes(): void {
    $public = ['permission_callback' => '__return_true', 'methods' => 'GET'];

    register_rest_route(MJ_NAMESPACE, '/projects', $public + [
        'callback' => static fn() => mj_collection('mj_project', 'mj_project_json'),
    ]);

    register_rest_route(MJ_NAMESPACE, '/services', $public + [
        'callback' => static fn() => mj_collection('mj_service', 'mj_service_json'),
    ]);

    register_rest_route(MJ_NAMESPACE, '/posts', $public + [
        'callback' => static fn() => mj_collection('post', 'mj_post_json', [
            'orderby'                => ['date' => 'DESC'],
            'update_post_term_cache' => true,
        ]),
    ]);

    register_rest_route(MJ_NAMESPACE, '/testimonials', $public + [
        'callback' => static fn() => mj_collection('mj_testimonial', 'mj_testimonial_json'),
    ]);

    register_rest_route(MJ_NAMESPACE, '/faq', $public + [
        'args'     => ['key' => ['required' => true, 'type' => 'string']],
        'callback' => static function (WP_REST_Request $request) {
            $key = (string) $request->get_param('key');
            foreach (mj_collection('mj_faq', 'mj_faq_json') as $set) {
                if ($set['key'] === $key) {
                    return $set['items'];
                }
            }
            return [];
        },
    ]);
}
add_action('rest_api_init', 'mj_register_routes');

/* -------------------------------------------------------------------------- */
/* Odświeżanie frontendu po publikacji                                        */
/* -------------------------------------------------------------------------- */

/**
 * Po zapisaniu treści woła webhook Next.js, żeby nie czekać na wygaśnięcie
 * pamięci podręcznej. Adres i sekret ustaw w wp-config.php:
 *
 *   define('MJ_REVALIDATE_URL',    'https://twojadomena.pl/api/revalidate');
 *   define('MJ_REVALIDATE_SECRET', '…ten sam co REVALIDATE_SECRET w Vercelu…');
 */
function mj_ping_frontend(int $post_id, WP_Post $post): void {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }
    if ($post->post_status !== 'publish') {
        return;
    }
    if (!defined('MJ_REVALIDATE_URL') || !defined('MJ_REVALIDATE_SECRET')) {
        return;
    }

    wp_remote_post(MJ_REVALIDATE_URL, [
        'timeout'  => 5,
        'blocking' => false,
        'headers'  => ['Content-Type' => 'application/json'],
        'body'     => wp_json_encode(['secret' => MJ_REVALIDATE_SECRET, 'tag' => 'content']),
    ]);
}
add_action('save_post', 'mj_ping_frontend', 10, 2);
