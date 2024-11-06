"use client";
import React, { useEffect, useState } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import Link from "next/link";
import Image from "next/image";
import ModalAddEvent from "../../../../components/Atoms/Modal/ModalAddEvent";
import { FetchData } from "../../../../config/Api/Api";
import { useSession } from "next-auth/react";
import { formatDateNew } from "../../../../utils/formateDate";
// import NewSelect from "../../../../components/Atoms/SelectInput/NewSelect";
// import { INITIAL_EVENTS, createEventId } from "./event-utils";

function Page() {
  const userSession = useSession();
  const token = userSession?.data?.user?.responseResult?.token;
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [events, setEvents] = useState([]);

  const [eventDetail, setEventDetail] = useState({
    date: new Date()
  });

  // console.log(eventDetail, "pppppppppppppppppppppdddddddddddddddd")
  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
  };

  const handleDateSelect = (selectInfo) => {
    let calendarApi = selectInfo.view.calendar;
    let newFormatDate = formatDateNew(calendarApi.currentData.dateSelection.range.start, "YYYY-MM-DD/numeric");
    setEventDetail({ ...eventDetail, date: newFormatDate })

  };

  const handleEventClick = (clickInfo) => {
    console.log(clickInfo.info);
    // if (clickInfo.jsEvent.which === 3) {
    //   // 3 mengindikasikan klik kanan
    //   alert(`Klik kanan pada acara: ${info.event.title}`);
    // }
    // if (
    //   confirm(
    //     `Are you sure you want to delete the event '${clickInfo.event.title}'`
    //   )
    // ) {
    //   clickInfo.event.remove();
    // }
  };

  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };

  const renderSidebarEvent = (event) => {
    return (
      <li key={event.id}>
        <b>
          {formatDate(event.start, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </b>
        <i>{event.title}</i>
      </li>
    );
  };

  let getEventData = async () => {
    FetchData({
      methode: "GET",
      url: "/list-event",
      token: token
    })
      .then((res) => {
        const data = res.responseResult?.flatMap((event) =>
          event.detailDateEvent.map((date) => ({
            title: event.event_name,
            start: new Date(date.date_event),
            end: new Date(date.date_event),
            color: "red",
          }))
        );
        setEvents(data);
      })
  }

  let getEventDetail = () => {
    FetchData({
      methode: "GET",
      url: "/list-event?date=" + eventDetail.date,
      token: token
    }).then((res) => {
      setEventDetail(
        {
          ...eventDetail,
          "event_name": res.responseResult.event_name,
          "desc": res.responseResult.desc,
          "link_meeting": res.responseResult.link_meeting,
          "timer": res.responseResult.timer,
        }
      )
    })
  }

  useEffect(() => {
    if (token)
      getEventData();
  }, [token])


  return (
    <div className="demo-app text-black ">
      <div className="flex items-start gap-">
        <div className="p-10 flex-1">
          <div className=" bg-white p-16 w-[100%] rounded-lg">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={weekendsVisible}
              eventContent={(eventInfo) => ({
                html: `<div style="background-color: #3498db; color: #fff;">${eventInfo.event.title}</div>`,
              })}
              // initialEvents={INITIAL_EVENTS}
              events={events}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventsSet={handleEvents}
            />
          </div>
        </div>
        <div className="bg-white h-screen">{RenderSidebar()}</div>
      </div>
    </div>
  );

  function RenderSidebar() {
    const [selectDay, setSelectDay] = useState(new Date());
    const [OpenModal, setOpenModal] = useState(false);

    const formater = (selectDay) => {
      const day = new Date(selectDay);
      day.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateFormatted = day.toLocaleDateString('id-ID', options);
      return dateFormatted;
    }

    return (
      <div className="">
        <ModalAddEvent selectDay={selectDay} isOpen={OpenModal} onClose={() => setOpenModal(false)} />
        <div className="">
          <Calendar onChange={(e) => setSelectDay({ ...eventDetail, date: e })} value={eventDetail.date} />
        </div>
        <div className="demo-app-sidebar-section mt-3 p-3">
          <div className="text-base font-semibold text-[#5D5FEF]">
            {formater(eventDetail.date)}
          </div>
          <div className="mt-2">
            <di className="flex items-start gap-4">
              <div className="bg-green-500 rounded-full p-2"></div>
              <div className="flex-1 ">
                <div className="text-sm font-semibold text-[#7D7D7D]">
                  {eventDetail.timer}
                </div>
                <div className="font-medium">{eventDetail.desc}</div>
                <div className="font-medium">{eventDetail.link_meeting}</div>
              </div>
            </di>
          </div>
        </div>
        <div
          onClick={() => setOpenModal(true)}
          className="bg-[#5D5FEF] cursor-pointer px-4 mt-5 py-2 mx-3 justify-center rounded-full flex items-center gap-2"
        >
          <Image
            className=""
            src="/icon/addCircle.svg"
            alt="Next.js Logo"
            width={20}
            height={20}
            priority
          />
          {/* <NewSelect /> */}
          <div className="font-semibold text-base text-white">
            Add New Event
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
