import React from 'react';
import { ActivityItem, Icon, Link, mergeStyleSets } from 'office-ui-fabric-react';
import WebFont from 'webfontloader';
const Activity = (props: any) => {
    const classNames = mergeStyleSets({
        exampleRoot: {
            marginTop: '20px',
        },
        nameText: {
            fontWeight: 'bold',
        },
    });
    const activityItemExamples = [];
    const history = JSON.parse(props.history);
    history.map((item) => {
        activityItemExamples.push({
            key: item.id,
            activityDescription: [
                <Link
                    key={1}
                    className={classNames.nameText}
                // onClick={() => {
                //     alert('A name was clicked.');
                // }}
                >
                    {item.actorName}
                </Link>,
                <span key={2}> {`${item.action} with comments: `}</span>,
                <span key={3}> {item.comments}</span>,

            ],
            activityPersonas: [

                // { imageUrl: `https://randomuser.me/api/portraits/women/28.jpg` },
                { imageUrl: `https://mso365e5.sharepoint.com/sites/ThePerspective/_layouts/15/userphoto.aspx?size=S&username=${item.actorEmail}` },
            ],
            timeStamp: item.time,
        });
    });

    // const activityItemExamples = [
    //     {
    //         key: 1,
    //         activityDescription: [
    //             <Link
    //                 key={1}
    //                 className={classNames.nameText}
    //                 onClick={() => {
    //                     alert('A name was clicked.');
    //                 }}
    //             >
    //                 Philippe Lampros
    //             </Link>,
    //             <span key={2}> commented</span>,
    //         ],
    //         activityIcon: <Icon iconName={'Message'} />,
    //         comments: [
    //             <span key={1}>Hello! I am making a comment and mentioning </span>,
    //             <Link
    //                 key={2}
    //                 className={classNames.nameText}
    //                 onClick={() => {
    //                     alert('An @mentioned name was clicked.');
    //                 }}
    //             >
    //                 @Anđela Debeljak
    //             </Link>,
    //             <span key={3}> in the text of the comment.</span>,
    //         ],
    //         timeStamp: 'Just now',
    //     },
    //     {
    //         key: 2,
    //         activityDescription: [
    //             <Link
    //                 key={1}
    //                 className={classNames.nameText}
    //                 onClick={() => {
    //                     alert('A name was clicked.');
    //                 }}
    //             >
    //                 Lisha Refai
    //             </Link>,
    //             <span key={2}> deleted </span>,
    //             <span key={3} className={classNames.nameText}>
    //                 DocumentTitle.docx
    //             </span>,
    //         ],
    //         activityIcon: <Icon iconName={'Trash'} />,
    //         timeStamp: '2 hours ago',
    //     },
    //     {
    //         key: 3,
    //         activityDescription: [
    //             <Link
    //                 key={1}
    //                 className={classNames.nameText}
    //                 onClick={() => {
    //                     alert('A name was clicked.');
    //                 }}
    //             >
    //                 Julian Arvidsson
    //             </Link>,
    //             <span key={2}> moved </span>,
    //             <Link
    //                 key={3}
    //                 className={classNames.nameText}
    //                 onClick={() => {
    //                     alert('A document was clicked.');
    //                 }}
    //             >
    //                 PresentationTitle.pptx
    //             </Link>,
    //             <span key={4}> to </span>,
    //             <Link
    //                 key={5}
    //                 className={classNames.nameText}
    //                 onClick={() => {
    //                     alert('A folder was clicked.');
    //                 }}
    //             >
    //                 Destination Folder
    //             </Link>,
    //             <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, magni nam corporis possimus eligendi, eos enim ullam doloribus ab assumenda magnam ut laudantium qui, quaerat odit? Iure aliquam totam cumque quam porro autem! Exercitationem, error id suscipit, sint voluptatem assumenda asperiores amet quaerat adipisci omnis quo explicabo magni, neque fuga.</p>
    //         ],
    //         activityIcon: <Icon iconName={'FabricMovetoFolder'} />,
    //         timeStamp: 'Yesterday',
    //     },
    // ];
    return (
        <div style={{ fontFamily: 'Droid Sans' }}>
            {activityItemExamples.map((item: { key: string | number }) => (
                <ActivityItem {...item} key={item.key} className={classNames.exampleRoot} />
            ))}
        </div>
    );
};

export default Activity;
