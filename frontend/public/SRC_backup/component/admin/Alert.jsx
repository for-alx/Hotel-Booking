import { memo } from "react"

const Alert = (probs) => {
    return (
        <>
            <div className="alert-container">
                { probs.alert.show && (
                        <div className={`alert alert-${probs.alert.type} alert-dismissible fade show`} role="alert">
                        { probs.alert.msg ? (
                            probs.alert.msg
                        ) : (
                            <p>Something is wrong please try again later</p>
                        ) }
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default memo(Alert)
