
class EventManager {
    constructor() {
        this.urlBase = "/events"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }

    obtenerDataInicial() {
        $.get(this.urlBase, (response) => {
            this.inicializarCalendario(response.data)
        })
    }

    eliminarEvento(evento) {
        $.ajax({
            url: `${this.urlBase}/${evento._id}`,
            type: 'DELETE'
        }).done( (response) => {
            alert(response.message);
        });
    }

    actualizarEvento(evento) {
        let start = null;
        let end = null;

        if(evento.end === null){
            start = moment(evento.start).format('YYYY-MM-DD');
        } else {
            start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'), 
            end = moment(evento.end).format('YYYY-MM-DD HH:mm:ss');
        }

        let data = {
            start: start,
            end: end
        }

        $.ajax({
            url: `${this.urlBase}/${evento._id}`,
            type: 'PUT', 
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done( (response) => {
            alert(response.message);
        });
    }  

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault()
            let title = $('#titulo').val(),
            start = $('#start_date').val(),
            end = '',
            start_hour = '',
            end_hour = '';

            if (!$('#allDay').is(':checked')) {
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour
                end = end + 'T' + end_hour
            }
            if (title != "" && start != "") {
                let ev = {
                    title: title,
                    start: start,
                    end: end
                }
                $.post(this.urlBase, ev, (response) => {
                    if( response.error )
                        alert(response.message);
                    else
                        alert(response.data.stringify())
                })
                $('.calendario').fullCalendar('renderEvent', ev)
            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    inicializarCalendario(eventos) {
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                this.actualizarEvento(event)
            },
            events: eventos,
            eventDragStart: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "img/trash-open.png");
                $('.delete').find('img').attr('width', "48px");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop: (event,jsEvent) => {
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                        this.eliminarEvento(event)
                        $('.calendario').fullCalendar('removeEvents', event.id);
                    }
                }
            })
        }
    }

    const Manager = new EventManager()
