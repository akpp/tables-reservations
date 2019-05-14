$(function () {
    let DATE;
    let TABLES_LIST = [];
    let TABLE_SELECTED_ID;
    let TABLES_RESERVED_IDS = [];
    const tablesSchemaUrl = 'http://127.0.0.1:8000/tables/schema';
    const getTablesUrl = 'http://127.0.0.1:8000/tables/';

    !function (a) {
        a.fn.datepicker.dates.ru = {
            days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
            daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
            daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            today: "Сегодня",
            clear: "Очистить",
            format: "dd.mm.yyyy",
            weekStart: 1
        }
    }(jQuery);


    $('#date').datepicker({
        format: "mm-dd-yyyy",
        todayBtn: "linked",
        language: "ru",
        todayHighlight: true,
        startDate: "now()",
        orientation: "top auto"
    })
        .on('changeDate', function (e) {
            const unixtime = Date.parse(e.date);
            const cdate = new Date(unixtime);
            DATE = `${cdate.getFullYear()}-${cdate.getMonth() + 1}-${cdate.getDate()}`;

            fetch(`${getTablesUrl}?date=${DATE}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    TABLES_RESERVED_IDS = data.map(x => x['table']);
                    showTables();
                });
        });


    function showTables() {
        document.getElementById('room-schema').innerHTML = "";
        TABLES_LIST.forEach(drawTable);
    }

    function drawTable(data) {
        const table = document.createElement('div');
        table.setAttribute('class', 'table');
        table.setAttribute('table_id', data['id']);
        // table.setAttribute('class', 'table2');


        const setStyle = {
            'width': `${data['width']}0%`,
            'height': `${data['length']}0%`,
            'left': `${data['coordinate_min_x']}0%`,
            'top': `${data['coordinate_min_y']}0%`,

        };
        for (prop of Object.keys(setStyle)) {
            table.style[prop.toString()] = setStyle[prop.toString()];
        }

        if (TABLES_RESERVED_IDS.includes(data['id'])) {
            table.className += ' reserved';
        } else {
            table.className += ' available';
        }
        const container = document.getElementById('room-schema');
        container.appendChild(table);

    }

    fetch(tablesSchemaUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            TABLES_LIST = data;
        });

    function showForm() {
        console.log('SELECTED id:', TABLE_SELECTED_ID);
        let style;
        if (TABLE_SELECTED_ID) {
            style = 'block';
        } else {
            style = 'none'
        }
        document.getElementById('uploadForm').style.display = style;
    }

    // listeners
    $(document).on('click', '.table.available', function () {
        const container = document.getElementById('room-schema');
        const tables = container.getElementsByClassName('available');

        if (this.className.includes('selected')) {
            this.className = this.className.replace(" selected", "");
            TABLE_SELECTED_ID = false;
        } else {
            for (let i = 0; i < tables.length; i++) {
                if (tables[i].className.includes('selected')) {
                    tables[i].className = tables[i].className.replace(" selected", "");
                }

            }
            this.className += ' selected';
            TABLE_SELECTED_ID = parseInt(this.getAttribute('table_id'));
        }
        showForm()
    });

    $(document).on('submit', '#uploadForm', function (e) {
        e.preventDefault();
        const table_id = TABLE_SELECTED_ID
        const params = {'date': DATE, 'table': table_id};
        $(this).serializeArray().map(function (obj) {
            params[obj.name] = obj.value;
        });
        console.log('params:', params,);
        postData(getTablesUrl, params)
            .then(data => {
                console.log(JSON.stringify(data))
                // location.reload();
                TABLES_RESERVED_IDS.push(table_id)
                showTables()
            }) // JSON-string from `response.json()` call
            .catch(error => console.error(error));
    });

    function postData(url = '', data = {}) {
        // Default options are marked with *
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then(response => response.json()); // parses JSON response into native Javascript objects
    }


});