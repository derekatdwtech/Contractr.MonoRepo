import React from 'react';
import { useEffect } from 'react';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import englishStrings from 'react-timeago/lib/language-strings/en';

const TimeSpan = (props) => {
    const {date} = props;
    const formatter = buildFormatter(englishStrings);
    useEffect(() => {

    }, [date] );
    return(
        <TimeAgo date={date} formatter={formatter} />
    );
}
export default TimeSpan;