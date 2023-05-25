import polyglotI18nProvider from 'ra-i18n-polyglot'


const EnglishLocalization = {
    rest:{
        notification: {
            add_member: "Can't add member to group",
            remove_member: "Can't delete member from group",
            send_message: "Can't send message to group",
            update_info: "Can't update info",
            update_info_good: "Successfully changed phone",
            create_chat: "Can't create group",
            search_user: 'Can\'t find user',
            code_sent: "Code sent",
            code_sent_bad: "Can't send code",
            error_occurred: 'Error occurred',
            log_out: "Successfully logged out",
            log_out_bad: "Can't log out",
            authorized: "Successfully authorized",
            authorized_bad: "Can't do authorization",
            instance: 'Instance information loaded !',
            instance_bad: 'Can\'t load instance information',
        },
        label: {
            add_member: "Add user to group",
            remove_member: 'Delete user from group',
            send_message: 'Write message',
            account_panel: 'Account panel',
            search_user: "Find user",
            type: 'Type',
            phone_number: 'Phone number',
            username: 'Username',
            search: 'Search',
            create_chat: 'Create new group',
            title: 'title',
            create: 'Create',
            change_info: 'Change info',
            number: 'number',
            message: 'message',
            authorized: 'You successfully authenticated ! ',
            code_pending: 'Code already sent to you',
            not_authorized: 'You not authorized yet to see information',
            token: 'Your JWT token',
            host: 'Query server url',
            password: "Password",
            password_repeat: "Repeat password",
            start_or_load: 'Start parsing or load already parsed objects',
            keyword: 'Keyword',
            prepare_mailing: 'Prepare mailing',
            parsed_users: 'Parsed users',
            parsed_chats: 'Parsed chats',
            parsed_contacts: 'Parsed contacts',
            parsed_keyword: 'Parsed by keywords',
            delete_message: 'Delete this message',
            new_message: 'New message',
        },
        button: {
            add_member: 'Add new member',
            remove_member: 'Remove user',
            send_message: 'Send',
            send_code: 'Send code',
            log_out: 'Log out',
            submit: 'Submit',
            sign_in: 'Sign in',
            register: 'Register',
            documentation: "Documentation",
            home: "Home Page",
            load_parsed: 'Load parsed',
            parsing_start: 'Start parsing',
            add_new_message: "Add new message",
            start_mailing: 'Start mailing',
            last_mailing: 'Load last mailing',
        }
    },
    ra: {
        action: {
            add_filter: 'Add filter',
            add: 'Add',
            back: 'Go Back',
            bulk_actions: '1 item selected |||| %{smart_count} items selected',
            cancel: 'Cancel',
            clear_array_input: 'Clear the list',
            clear_input_value: 'Clear value',
            clone: 'Clone',
            confirm: 'Confirm',
            create: 'Create',
            create_item: 'Create %{item}',
            delete: 'Delete',
            edit: 'Edit',
            export: 'Export',
            list: 'List',
            refresh: 'Refresh',
            remove_filter: 'Remove this filter',
            remove_all_filters: 'Remove all filters',
            remove: 'Remove',
            save: 'Save',
            search: 'Search',
            select_all: 'Select all',
            select_row: 'Select this row',
            show: 'Show',
            sort: 'Sort',
            undo: 'Undo',
            unselect: 'Unselect',
            expand: 'Expand',
            close: 'Close',
            open_menu: 'Open menu',
            close_menu: 'Close menu',
            update: 'Update',
            move_up: 'Move up',
            move_down: 'Move down',
            open: 'Open',
            toggle_theme: 'Toggle Theme',
            select_columns: 'Columns',
        },
        boolean: {
            true: 'Yes',
            false: 'No',
            null: ' ',
        },
        page: {
            create: 'Create %{name}',
            dashboard: 'Dashboard',
            edit: '%{name} %{recordRepresentation}',
            error: 'Something went wrong',
            list: '%{name}',
            loading: 'Loading',
            not_found: 'Not Found',
            show: '%{name} %{recordRepresentation}',
            empty: 'No %{name} yet.',
            invite: 'Do you want to add one?',
        },
        input: {
            file: {
                upload_several:
                    'Drop some files to upload, or click to select one.',
                upload_single: 'Drop a file to upload, or click to select it.',
            },
            image: {
                upload_several:
                    'Drop some pictures to upload, or click to select one.',
                upload_single:
                    'Drop a picture to upload, or click to select it.',
            },
            references: {
                all_missing: 'Unable to find references data.',
                many_missing:
                    'At least one of the associated references no longer appears to be available.',
                single_missing:
                    'Associated reference no longer appears to be available.',
            },
            password: {
                toggle_visible: 'Hide password',
                toggle_hidden: 'Show password',
            },
        },
        message: {
            about: 'About',
            are_you_sure: 'Are you sure?',
            auth_error:
                'A error occurred while validating the authentication token.',
            bulk_delete_content:
                'Are you sure you want to delete this %{name}? |||| Are you sure you want to delete these %{smart_count} items?',
            bulk_delete_title:
                'Delete %{name} |||| Delete %{smart_count} %{name}',
            bulk_update_content:
                'Are you sure you want to update this %{name}? |||| Are you sure you want to update these %{smart_count} items?',
            bulk_update_title:
                'Update %{name} |||| Update %{smart_count} %{name}',
            clear_array_input: 'Are you sure you want to clear the whole list?',
            delete_content: 'Are you sure you want to delete this item?',
            delete_title: 'Delete %{name} #%{id}',
            details: 'Details',
            error:
                "A client error occurred and your request couldn't be completed.",

            invalid_form: 'The form is not valid. Please check for errors',
            loading: 'The page is loading, just a moment please',
            no: 'No',
            not_found:
                'Either you typed a wrong URL, or you followed a bad link.',
            yes: 'Yes',
            unsaved_changes:
                "Some of your changes weren't saved. Are you sure you want to ignore them?",
        },
        navigation: {
            no_results: 'No results found',
            no_more_results:
                'The page number %{page} is out of boundaries. Try the previous page.',
            page_out_of_boundaries: 'Page number %{page} out of boundaries',
            page_out_from_end: 'Cannot go after last page',
            page_out_from_begin: 'Cannot go before page 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} of %{total}',
            partial_page_range_info:
                '%{offsetBegin}-%{offsetEnd} of more than %{offsetEnd}',
            current_page: 'Page %{page}',
            page: 'Go to page %{page}',
            first: 'Go to first page',
            last: 'Go to last page',
            next: 'Go to next page',
            previous: 'Go to previous page',
            page_rows_per_page: 'Rows per page:',
            skip_nav: 'Skip to content',
        },
        sort: {
            sort_by: 'Sort by %{field} %{order}',
            ASC: 'ascending',
            DESC: 'descending',
        },
        auth: {
            auth_check_error: 'Please login to continue',
            user_menu: 'Profile',
            username: 'Username',
            password: 'Password',
            sign_in: 'Sign in',
            sign_in_error: 'Authentication failed, please retry',
            logout: 'Logout',
        },
        notification: {
            updated: 'Element updated |||| %{smart_count} elements updated',
            created: 'Element created',
            deleted: 'Element deleted |||| %{smart_count} elements deleted',
            bad_item: 'Incorrect element',
            item_doesnt_exist: 'Element does not exist',
            http_error: 'Server communication error',
            data_provider_error:
                'dataProvider error. Check the console for details.',
            i18n_error:
                'Cannot load the translations for the specified language',
            canceled: 'Action cancelled',
            logged_out: 'Your session has ended, please reconnect.',
            not_authorized: "You're not authorized to access this resource.",
        },
        validation: {
            required: 'Required',
            minLength: 'Must be %{min} characters at least',
            maxLength: 'Must be %{max} characters or less',
            minValue: 'Must be at least %{min}',
            maxValue: 'Must be %{max} or less',
            number: 'Must be a number',
            email: 'Must be a valid email',
            oneOf: 'Must be one of: %{options}',
            regex: 'Must match a specific format (regexp): %{pattern}',
        },
        saved_queries: {
            label: 'Saved queries',
            query_name: 'Query name',
            new_label: 'Save current query...',
            new_dialog_title: 'Save current query as',
            remove_label: 'Remove saved query',
            remove_label_with_name: 'Remove query "%{name}"',
            remove_dialog_title: 'Remove saved query?',
            remove_message:
                'Are you sure you want to remove that item from your list of saved queries?',
            help: 'Filter the list and save this query for later',
        },
        configurable: {
            customize: 'Customize',
            configureMode: 'Configure this page',
            inspector: {
                title: 'Inspector',
                content: 'Hover the application UI elements to configure them',
                reset: 'Reset Settings',
                hideAll: 'Hide All',
                showAll: 'Show All',
            },
            Datagrid: {
                title: 'Datagrid',
                unlabeled: 'Unlabeled column #%{column}',
            },
            SimpleForm: {
                title: 'Form',
                unlabeled: 'Unlabeled input #%{input}',
            },
            SimpleList: {
                title: 'List',
                primaryText: 'Primary text',
                secondaryText: 'Secondary text',
                tertiaryText: 'Tertiary text',
            },
        },
    }
}


const UkrainianLocalization = {
    rest:{
        notification: {
            add_member: "Неможливо додати учасника до групи",
            remove_member: "Неможливо видалити учасника з групи",
            send_message: "Неможливо надіслати повідомлення групі",
            update_info: "Неможливо обновити інфо",
            update_info_good: "Телефон успішно змінено",
            create_chat: "Неможливо створити групу",
            search_user: 'Неможливо знайти користувача',
            code_sent: "Код надіслано",
            code_sent_bad: "Неможливо надіслати код",
            error_occurred: 'Сталася помилка',
            log_out: "Вихід успішний",
            log_out_bad: "Неможливо вийти",
            authorized: "Успішно авторизовано",
            authorized_bad: "Неможливо здійснити авторизацію",
            instance: 'Інформацію про інстанс завантажено !',
            instance_bad: 'Неможливо завантажити інформацію про інстанс',
        },
        label: {
            add_member: "Додати користувача до групи",
            remove_member: 'Видалити користувача з групи',
            send_message: 'Напсати повідомлення',
            account_panel: 'Панель облікового запису',
            search_user: "Знайти користувача",
            type: 'Тип',
            phone_number: 'Номер телефону',
            username: 'Користувач',
            search: 'Пошук',
            create_chat: 'Створити нову групу',
            title: 'заголовок',
            create: 'Створити',
            change_info: 'Замініти інфо',
            number: 'номер',
            message: 'повідомлення',
            authorized: 'Ви успішно авторизовані !',
            code_pending: 'Код вже надісланий вам',
            not_authorized: 'Ви ще не авторизовані, щоб дивитися інформацію',
            token: 'Ваш JWT токен',
            host: 'Url для запитів',
            password: "Пароль",
            password_repeat: "Повторення паролю",
            start_or_load: "Почніть парсинг або завантажте вже спаршені об'єкти",
            keyword: 'Ключове слово',
            prepare_mailing: 'Підготувати розсилку',
            parsed_users: 'Спаршені користувачі',
            parsed_chats: 'Спаршені чати',
            parsed_contacts: 'Спаршені контакти',
            parsed_keyword: 'Спаршене по ключовим словам',
            delete_message: 'Видалити повідомлення',
            new_message: 'Нове повідомлення',
        },
        button: {
            add_member: 'Додати нового учасника',
            remove_member: 'Видалити учасника',
            send_message: 'Надіслати',
            send_code: 'Надіслати код',
            log_out: 'Вийти',
            submit: 'Підтвердити',
            sign_in: 'Увійти',
            register: 'Зареєструватися',
            documentation: "Документація",
            home: "Домівка",
            load_parsed: 'Завантажити спаршене',
            parsing_start: 'Почати парсинг',
            add_new_message: "Додати нове повідомлення",
            start_mailing: 'Почати розсилку',
            last_mailing: 'Загрузити останню розсилку',
        }
    },
    ra: {
        action: {
            add_filter: "Додати фільтр",
            add: "Додати",
            back: "Повернутися назад",
            bulk_actions: "%{smart_count} обрано",
            cancel: "Відмінити",
            clear_array_input: 'Очистити всі елементи',
            clear_input_value: "Очистити",
            clone: "Дублювати",
            confirm: "Підтвердити",
            create: "Створити",
            create_item: "Створити %{item}",
            delete: "Видалити",
            edit: "Редагувати",
            export: "Експортувати",
            list: "Перелік",
            refresh: "Оновити",
            remove_filter: "Прибрати фільтр",
            remove_all_filters: "Прибрати всі фільтри",
            remove: "Видалити",
            save: "Зберегти",
            search: "Пошук",
            select_all: "Обрати всі",
            select_row: "Обрати цей рядок",
            show: "Перегляд",
            sort: "Сортувати",
            undo: "Скасувати",
            unselect: "Зняти обрання",
            expand: "Розкрити",
            close: "Закрити",
            open_menu: "Меню",
            close_menu: "Закрити меню",
            update: "Оновити",
            move_up: "Вгору",
            move_down: "Вниз",
            open: "Відкрити",
            toggle_theme: "Змінити тему",
            select_columns: "Стовпці",
        },
        boolean: {
            true: "Так",
            false: "Ні",
            null: " ",
        },
        page: {
            create: "Створити %{name}",
            dashboard: "Дашборд",
            edit: "%{name} #%{id}",
            error: "Щось пішло не так",
            list: "%{name}",
            loading: "Завантаження",
            not_found: "Не знайдено",
            show: "%{name} #%{id}",
            empty: "Ще немає %{name}.",
            invite: "Бажаєте додати?",
        },
        input: {
            file: {
                upload_several: "Перетягніть файли сюди, або натисніть для вибору.",
                upload_single: "Перетягніть файл сюди, або натисніть для вибору.",
            },
            image: {
                upload_several: "Перетягніть зображення сюди, або натисніть для вибору.",
                upload_single: "Перетягніть зображення сюди, або натисніть для вибору.",
            },
            references: {
                all_missing: "Неможливо знайти дані посилань.",
                many_missing: "Щонайменьше одне з пов'язаних посилань більше не доступно.",
                single_missing: "Пов'язане посилання більше не доступно.",
            },
            password: {
                toggle_visible: "Сховати пароль",
                toggle_hidden: "Показати пароль",
            },
        },
        message: {
            about: "Довідка",
            are_you_sure: "Ви впевнені?",
            bulk_delete_content:
                "Ви дійсно хочете видалити це %{name}? |||| Ви впевнені що хочете видалити ці %{smart_count} %{name}?",
            bulk_delete_title: "Видалити %{name} |||| Видалити %{smart_count} %{name} елементів",
            bulk_update_content:
                "Ви дійсно хочете оновити це %{name}? |||| Ви впевнені що хочете оновити ці %{smart_count} %{name}?",
            bulk_update_title: "Оновити %{name} |||| Оновити %{smart_count} %{name}",
            clear_array_input: 'Ви впевнені що хочете видалити всі елементи?',
            delete_content: "Ви впевнені що хочете видалити цей елемент?",
            delete_title: "Видалити %{name} #%{id}",
            details: "Деталі",
            error: "Виникла помилка на стороні клієнта і ваш запит не був завершений.",
            invalid_form: "Форма недійсна. Перевірте помилки",
            loading: "Сторінка завантажується, хвилинку будь ласка",
            no: "Ні",
            not_found: "Ви набрали невірний URL-адресу, або перейшли за хибним посиланням.",
            yes: "Так",
            unsaved_changes: "Деякі зміни не були збережені.Ви впевнені що хочете проігнорувати їх?",
        },
        navigation: {
            no_results: "Результатів не знайдено",
            no_more_results: "Номер сторінки %{page} знаходиться за межами кордонів. Спробуйте попередню сторінку.",
            page_out_of_boundaries: "Сторінка %{page} поза межами",
            page_out_from_end: "Неможливо переміститися далі останньої сторінки",
            page_out_from_begin: "Номер сторінки не може бути менше 1",
            page_range_info: "%{offsetBegin}-%{offsetEnd} із %{total}",
            partial_page_range_info: "%{offsetBegin}-%{offsetEnd} з більше ніж %{offsetEnd}",
            current_page: "Сторінка %{page}",
            page: "Перейти на сторінку %{page}",
            first: "Перейти на першу сторінку",
            last: "Перейти на останню сторінку",
            previous: "Перейти на попередню сторінку",
            page_rows_per_page: "Рядків на сторінці:",
            next: "Наступна",
            prev: "Попередня",
            skip_nav: "Перейти до змісту",
        },
        sort: {
            sort_by: "Сортувати за %{field} %{order}",
            ASC: "верхобіжний",
            DESC: "низобіжний",
        },
        auth: {
            auth_check_error: "Щоб продовжити, будь ласка залогінтеся",
            user_menu: "Профіль",
            username: "Ім'я користувача",
            password: "Пароль",
            sign_in: "Ввійти",
            sign_in_error: "Помилка аутентифікації, спробуйте знову",
            logout: "Вийти",
        },
        notification: {
            updated: "Елемент оновлено |||| %{smart_count} елемент оновлено",
            created: "Елемент створений",
            deleted: "Елемент видалений |||| %{smart_count} елемент видалено",
            bad_item: "Хибний елемент",
            item_doesnt_exist: "Елемент не існує",
            http_error: "Помилка сервера",
            data_provider_error: "Помилка в dataProvider. Перевірте деталі в консолі.",
            i18n_error: "Не вдалося завантажити переклад для вибраної мови",
            canceled: "Дія відмінена",
            logged_out: "Ваша логін-сессія завершена, будь ласка залогінтесь знову.",
            not_authorized: "Немає доступу до цього ресурсу.",
        },
        validation: {
            required: "Обов'язково для заповнення",
            minLength: "Мінімальна кількість символів %{min}",
            maxLength: "Максимальна кількість символів %{max}",
            minValue: "Мінімальне значення %{min}",
            maxValue: "Значення може бути %{max} або менше",
            number: "Повинна бути цифра",
            email: "Хибний email",
            oneOf: "Повинен бути одним з: %{options}",
            regex: "Повинен відповідати певним форматом (регулярний вираз): %{pattern}",
        },
        saved_queries: {
            label: "Зберегти запит",
            query_name: "Назва запиту",
            new_label: "Зберегти поточний запит...",
            new_dialog_title: "Зберегти поточний запит як",
            remove_label: "Видалити збережений запит",
            remove_label_with_name: 'Видалити запит "%{name}"',
            remove_dialog_title: "Видалити збережений запит?",
            remove_message: "Ви впевнені, що бажаєте видалити цей елемент зі списку збережених запитів?",
            help: "Відфільтруйте список і збережіть цей запит на потім",
        },
        configurable: {
            customize: "Налаштувати",
            configureMode: "Налаштувати сторінку",
            inspector: {
                title: "Інспектор",
                content: "Наведіть на UI елемент щоб налаштувати його",
                reset: "Скинути налаштування",
            },
            SimpleList: {
                primaryText: "Основний текст",
                secondaryText: "Вторинний текст",
                tertiaryText: "Третинний текст",
            },
        },
    },
}


const locales = {
    'en': EnglishLocalization,
    'ua': UkrainianLocalization
}

const localizationList = [
    {locale: 'en', name: 'English'},
    {locale: 'ua', name: 'Українська'}
]


export const i18nProvider = polyglotI18nProvider(
    locale => locales[locale],
    'en',
    localizationList
)